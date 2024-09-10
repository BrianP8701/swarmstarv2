import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { PubSub } from '@google-cloud/pubsub';
import express from 'express';
import http from 'http';
import { injectable } from 'inversify';

@injectable()
export class WebSocketServer {
  private wss: WSServer;
  private userConnections: Map<string, WebSocket> = new Map();

  constructor() {
    const app = express();
    const server = http.createServer(app);
    this.wss = new WSServer({ server });

    this.wss.on('connection', this.handleConnection.bind(this));

    const pubsub = new PubSub();
    pubsub.subscription('websocket-messages').on('message', this.handlePubSubMessage.bind(this));

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`WebSocket server is running on port ${PORT}`);
    });
  }

  private handleConnection(ws: WebSocket, req: http.IncomingMessage) {
    const userId = req.url?.split('=')[1];
    if (userId) {
      this.userConnections.set(userId, ws);
      console.log(`User ${userId} connected`);

      ws.on('close', () => {
        this.userConnections.delete(userId);
        console.log(`User ${userId} disconnected`);
      });
    } else {
      ws.close(1008, 'User ID not provided');
    }
  }

  private handlePubSubMessage(message: any) {
    const { userId, data } = JSON.parse(message.data.toString());
    this.sendMessageToUser(userId, data);
    message.ack();
  }

  public sendMessageToUser(userId: string, data: any) {
    const userWs = this.userConnections.get(userId);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
      userWs.send(JSON.stringify(data));
      console.log(`Message sent to user ${userId}`);
    } else {
      console.log(`User ${userId} not connected or connection not open`);
    }
  }
}

// Create an instance of the WebSocketServer
const webSocketServer = new WebSocketServer();
export default webSocketServer;