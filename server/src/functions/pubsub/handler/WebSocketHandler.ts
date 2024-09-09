import functions from '@google-cloud/functions-framework'
import { injectable } from 'inversify'
import { container } from '../../../utils/di/container'
import { CloudEventPayload, CloudEventSubscriberFunction } from '../CloudEventSubscriber'
import { PubSubTopic } from '../PubSubTopic'
import { WebSocketPayload } from '../payload/WebSocketPayload'
import { WebSocketServer } from '../../../websocket-server'

@injectable()
export class WebSocketHandler extends CloudEventSubscriberFunction<PubSubTopic.WebSocketHandler> {
  constructor(private webSocketServer: WebSocketServer) {
    super()
  }

  protected getTopic(): PubSubTopic.WebSocketHandler {
    return PubSubTopic.WebSocketHandler
  }

  public handle = async (payload: WebSocketPayload) => {
    await this.webSocketServer.sendMessageToClient(payload.clientId, payload.message)
  }

  static eventHandler = async (cloudEvent: functions.CloudEvent<CloudEventPayload>) => {
    const instance = container.get(WebSocketHandler)
    await instance.handleEvent(cloudEvent)
  }
}