import { Chat, Memory, Prisma, PrismaClient, Swarm, User } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class UserDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async get(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    })
  }

  async getWithData(id: string): Promise<User & { swarms: Swarm[], memories: Memory[] }> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { swarms: true, memories: true },
    })
  }

  async create(userCreateInput: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: userCreateInput,
    })
  }

  async getSwarms(id: string): Promise<Swarm []> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { swarms: true },
    });
    return user.swarms;
  }

  async getMemories(id: string): Promise<Memory[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { memories: true },
    });
    return user.memories;
  }
}