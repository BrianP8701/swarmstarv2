import { Chat, Memory, Prisma, PrismaClient, Swarm } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class UserDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async get(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    })
  }

  async create(userCreateInput: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: userCreateInput,
    })
  }

  async getSwarms(id: string): Promise<Swarm[]> {
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