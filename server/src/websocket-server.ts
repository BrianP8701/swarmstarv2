import 'reflect-metadata';
import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { PubSub } from '@google-cloud/pubsub';
import http from 'http';
import { injectable } from 'inversify';
import { logger } from './utils/logging/logger';
import { SecretService, Environment } from './services/SecretService';
import { container } from './utils/di/container';
import { checkAuthenticated } from './utils/auth/auth';
import { AuthenticatedRequest } from './utils/auth/AuthRequest';
import { Response } from 'express';

@injectable()
export class WebSocketServer {
  private wss: WSServer;
  private userConnections: Map<string, WebSocket> = new Map();
  private secretService: SecretService;

  constructor() {
    this.secretService = container.get(SecretService);
    const server = http.createServer();
    this.wss = new WSServer({ server });

    this.wss.on('connection', this.handleConnection.bind(this));

    const envVars = this.secretService.getEnvVars();
    if (envVars.MODE !== Environment.LOCAL) {
      this.setupPubSub();
    }

    const WS_PORT = process.env.WS_PORT || 8080;
    server.listen(WS_PORT, () => {
      logger.info(`WebSocket server is running on port ${WS_PORT}`);
    });
  }

  private setupPubSub() {
    const pubsub = new PubSub();
    const subscriptionName = 'websocket-messages';
    pubsub.subscription(subscriptionName).on('error', (error) => {
      logger.error(`Error with PubSub subscription '${subscriptionName}':`, error);
    });
    pubsub.subscription(subscriptionName).on('message', this.handlePubSubMessage.bind(this));
  }

  private async handleConnection(ws: WebSocket, req: http.IncomingMessage) {
    const token = new URLSearchParams(req.url?.split('?')[1]).get('token');
    if (token) {
      const userId = await this.verifyToken(token);
      if (userId) {
        this.userConnections.set(userId, ws);
        logger.info(`User ${userId} connected`);

        ws.on('close', () => {
          this.userConnections.delete(userId);
          logger.info(`User ${userId} disconnected`);
        });
      } else {
        ws.close(1008, 'Invalid token');
      }
    } else {
      ws.close(1008, 'Token not provided');
    }
  }

  private async verifyToken(token: string): Promise<string | null> {
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthenticatedRequest;
    const res = {} as http.ServerResponse;
    const next = () => {};

    await checkAuthenticated(req, res as Response, next);

    return req.user ? req.user.id : null;
  }

  private handlePubSubMessage(message: { data: Buffer; ack: () => void }) {
    const { userId, data } = JSON.parse(message.data.toString());
    this.sendMessageToUser(userId, data);
    message.ack();
  }

  public sendMessageToUser(userId: string, data: unknown) {
    const userWs = this.userConnections.get(userId);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
      userWs.send(JSON.stringify(data));
      logger.info(`Message sent to user ${userId}`);
    } else {
      logger.info(`User ${userId} not connected or connection not open`);
    }
  }

  public getUserConnection(userId: string): WebSocket | null {
    return this.userConnections.get(userId) || null;
  }
}

// Initialize the WebSocket server
new WebSocketServer();