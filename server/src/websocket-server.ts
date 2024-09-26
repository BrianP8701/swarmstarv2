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
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';

@injectable()
export class WebSocketServer {
  private static instance: WebSocketServer | null = null;
  private wss: WSServer | null = null;
  private server: http.Server | null = null;
  private userConnections: Map<string, WebSocket> = new Map();
  private secretService: SecretService;

  public constructor() {
    this.secretService = container.get(SecretService);
  }

  public static getInstance(): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer();
    }
    return WebSocketServer.instance;
  }

  public async initialize() {
    if (this.wss) {
      logger.warn('WebSocket server is already initialized');
      return;
    }

    this.server = http.createServer();
    this.wss = new WSServer({
      server: this.server,
      path: '/graphql',
    });

    this.wss.on('connection', this.handleConnection.bind(this));

    const envVars = this.secretService.getEnvVars();
    if (envVars.MODE !== Environment.LOCAL) {
      this.setupPubSub();
    }

    const schema = makeExecutableSchema({ typeDefs, resolvers });
    
    useServer(
      {
        schema,
        context: async (ctx) => {
          const token = (ctx.connectionParams as { Authorization?: string })?.Authorization?.split(' ')[1];
          if (!token) {
            throw new Error('Authentication failed: No token provided');
          }
          const userId = await this.verifyToken(token);
          if (!userId) {
            throw new Error('Authentication failed: Invalid token');
          }
          return { userId };
        },
      },
      this.wss
    );

    await this.startServer();
  }

  private async startServer(retryCount: number = 0) {
    const maxRetries = 5;
    const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10) + retryCount;

    try {
      await new Promise<void>((resolve, reject) => {
        this.server!.listen(WS_PORT)
          .once('listening', () => {
            logger.info(`WebSocket server is running on port ${WS_PORT}`);
            resolve();
          })
          .once('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
              logger.warn(`Port ${WS_PORT} is in use`);
              reject(err);
            } else {
              logger.error('Failed to start WebSocket server:', err);
              reject(err);
            }
          });
      });
    } catch (error) {
      if (retryCount < maxRetries) {
        logger.info(`Retrying with port ${WS_PORT + 1}`);
        await this.startServer(retryCount + 1);
      } else {
        logger.error(`Failed to start WebSocket server after ${maxRetries} attempts`);
        throw error;
      }
    }
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
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    logger.info(`User ${userId} connected`);
    logger.info(`Token: ${token}`);

    if (token && userId) {
      const isValidToken = await this.verifyToken(token);
      if (isValidToken) {
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
      ws.close(1008, 'Token or userId not provided');
    }
  }

  private async verifyToken(token: string): Promise<string | null> {
    try {
      const req = { 
        headers: { authorization: `Bearer ${token}` }
      } as AuthenticatedRequest;
      const res = {} as Response;
      const next = () => {};

      await checkAuthenticated(req, res, next);
      return req.auth?.userId || null;
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
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
