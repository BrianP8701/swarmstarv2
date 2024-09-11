import { injectable, inject } from 'inversify'
import { PubSubTopic } from '../PubSubTopic'
import { WebSocketPayload } from '../payload/WebSocketPayload'
import { WebSocketServer } from '../../../websocket-server'
import { NonCloudFunctionHandler } from '../NonCloudFunctionHandler'

@injectable()
export class WebSocketHandler extends NonCloudFunctionHandler<PubSubTopic.WebSocketHandler> {
  constructor(@inject(WebSocketServer) private webSocketServer: WebSocketServer) {
    super()
  }

  public getTopic(): PubSubTopic.WebSocketHandler {
    return PubSubTopic.WebSocketHandler
  }

  public async handle(payload: WebSocketPayload): Promise<void> {
    await this.webSocketServer.sendMessageToUser(payload.userId, payload.message)
  }
}