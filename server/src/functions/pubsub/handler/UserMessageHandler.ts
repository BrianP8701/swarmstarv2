import functions from '@google-cloud/functions-framework'

import { inject, injectable } from 'inversify'
import { container } from '../../../utils/di/container'
import { CloudEventPayload, CloudEventSubscriberFunction } from '../CloudEventSubscriber'
import { PubSubTopic } from '../PubSubTopic'
import { UserMessagePayload } from '../payload/UserMessagePayload'
// import { ChatService } from '../../../services/ChatService'
import { WebSocketMessageType } from '../payload/WebSocketPayload'
import { ChatDao } from '../../../dao/ChatDao'
import { MessageRoleEnum } from '@prisma/client'

@injectable()
export class UserMessageHandler extends CloudEventSubscriberFunction<PubSubTopic.UserMessageHandler> {
  constructor(
    // @inject(ChatService) private chatService: ChatService,
    @inject(ChatDao) private chatDao: ChatDao
  ) {
    super()
  }

  public getTopic(): PubSubTopic.UserMessageHandler {
    return PubSubTopic.UserMessageHandler
  }

  public handle = async (_payload: UserMessagePayload) => {
    const chatId = _payload.chatId
    const userId = await this.chatDao.getUserIdFromChatId(chatId)
    // const response = await this.chatService.generateResponse(chatId)
    const response = 'yb better'
    const message = await this.chatDao.sendMessage(chatId, response, MessageRoleEnum.ASSISTANT)
    await this.pubSubMediator.publishEvent(PubSubTopic.WebSocketHandler, {
      userId,
      type: WebSocketMessageType.NEW_MESSAGE,
      body: {
        messageId: message.id,
      },
    })
  }

  static eventHandler = async (cloudEvent: functions.CloudEvent<CloudEventPayload>) => {
    const instance = container.get(UserMessageHandler)
    await instance.handleEvent(cloudEvent)
  }
}
