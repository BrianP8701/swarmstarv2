import { injectable } from "inversify"
import { WebSocketServer } from '../websocket-server'
import { WebSocket } from 'ws'

@injectable()
export class WebSocketService {
  constructor(private webSocketServer: WebSocketServer) {}

  public getConnection(userId: string): WebSocket | null {
    return this.webSocketServer.getUserConnection(userId);
  }

  public sendMessageToUser(userId: string, data: unknown): void {
    this.webSocketServer.sendMessageToUser(userId, data);
  }
}
