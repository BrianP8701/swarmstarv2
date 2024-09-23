import { Chat, Message, Prisma, PrismaClient } from '@prisma/client'
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
}
