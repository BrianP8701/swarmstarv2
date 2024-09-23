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

  async sendMessage(chatId: string, message: string): Promise<Chat & { messages: Message[] }> {
    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        messages: {
          create: {
            content: message,
            role: MessageRoleEnum.USER,
          },
        },
      },
      include: {
        messages: true,
      },
    })
  }
}
