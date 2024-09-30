import { Chat, Message, MessageRoleEnum, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class ChatDao extends AbstractDao<Chat, Prisma.ChatCreateInput, Prisma.ChatUpdateInput, Prisma.ChatInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<Chat> {
    return this.prisma.chat.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({ where: { id } })
    return chat !== null
  }

  async create(chatCreateInput: Prisma.ChatCreateInput, includeClauses?: Prisma.ChatInclude): Promise<Chat> {
    return this.prisma.chat.create({
      data: chatCreateInput,
      include: includeClauses,
    })
  }

  async update(id: string, updateInput: Prisma.ChatUpdateInput): Promise<Chat> {
    return this.prisma.chat.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chat.delete({ where: { id } })
  }

  // Additional methods
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
    })
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
