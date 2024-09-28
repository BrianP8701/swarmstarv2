import { Chat, Message, MessageRoleEnum, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class ChatDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async create(chatCreateInput: Prisma.ChatCreateInput) {
    return this.prisma.chat.create({
      data: chatCreateInput,
    })
  }

  async get(chatId: string): Promise<Chat> {
    return this.prisma.chat.findUniqueOrThrow({
      where: {
        id: chatId,
      },
    })
  }

  async getWithMessages(chatId: string): Promise<Chat & { messages: Message[] }> {
    return this.prisma.chat.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    })
  }

  async getMessage(messageId: string): Promise<Message> {
    return this.prisma.message.findUniqueOrThrow({
      where: {
        id: messageId,
      },
    })
  }

  async sendMessage(chatId: string, message: string, role: MessageRoleEnum): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content: message,
        role,
        chatId,
      },
    });
  }

  async getUserIdFromChatId(chatId: string): Promise<string> {
    const userIdOnChat = await this.prisma.chat.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      select: {
        swarm: {
          select: {
            userId: true,
          },
        },
      },
    })
    return userIdOnChat.swarm.userId
  }
}
