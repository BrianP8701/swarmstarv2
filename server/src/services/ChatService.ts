import { inject, injectable } from 'inversify'
import { ChatDao } from '../dao/ChatDao'
import { PubSubMediator } from '../functions/pubsub/PubSubMediator'
import { Chat, Message, MessageRoleEnum } from '@prisma/client'
import { PubSubTopic } from '../functions/pubsub/PubSubTopic'
import { formatDbChatToInstructorChat } from './formatters/chatFormatters'
import { ChainOfThoughtInstructor } from '../swarmstar/instructors/ChainOfThoughtInstructor'

@injectable()
export class ChatService {
  constructor(
    @inject(ChatDao) private chatDao: ChatDao,
    @inject(PubSubMediator) private pubSubMediator: PubSubMediator,
    @inject(ChainOfThoughtInstructor) private chainOfThoughtInstructor: ChainOfThoughtInstructor
  ) {}

  public async sendMessage(
    chatId: string,
    message: string,
    role: MessageRoleEnum
  ): Promise<Chat & { messages: Message[] }> {
    await this.chatDao.sendMessage(chatId, message, role)
    const chat = await this.chatDao.getWithMessages(chatId)
    await this.pubSubMediator.publishEvent(PubSubTopic.UserMessageHandler, {
      chatId,
    })
    return chat
  }

  public async generateResponse(chatId: string): Promise<string> {
    const chat = await this.chatDao.getWithMessages(chatId)
    const response = await this.chainOfThoughtInstructor.run({
      conversation: formatDbChatToInstructorChat(chat.messages),
    })
    await this.chatDao.sendMessage(chatId, response.response, MessageRoleEnum.ASSISTANT)
    return response.response
  }
}
