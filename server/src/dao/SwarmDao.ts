import { Chat, Memory, Prisma, PrismaClient, Swarm } from '@prisma/client'
import assert from 'assert'
import { inject, injectable } from 'inversify'

@injectable()
export class SwarmDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async create(swarmCreateInput: Prisma.SwarmCreateInput) {
    return this.prisma.swarm.create({
      data: swarmCreateInput,
    })
  }

  async get(swarmId: string): Promise<Swarm & { chats: Chat[], memory: Memory }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { chats: true, memory: true },
    })
  }

  async update(
    swarmId: string,
    swarmUpdateInput: Prisma.SwarmUpdateInput
  ) {
    return this.prisma.swarm.update({
      where: { id: swarmId },
      data: swarmUpdateInput,
    })
  }

  async delete(swarmId: string) {
    return this.prisma.swarm.delete({
      where: { id: swarmId },
    })
  }
}
