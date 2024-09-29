import { Chat, Prisma, PrismaClient, Swarm } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class SwarmDao extends AbstractDao<Swarm, Prisma.SwarmCreateInput, Prisma.SwarmUpdateInput, Prisma.SwarmInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async get(id: string): Promise<Swarm> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const swarm = await this.prisma.swarm.findUnique({ where: { id } });
    return swarm !== null;
  }

  async create(swarmCreateInput: Prisma.SwarmCreateInput, includeClauses?: Prisma.SwarmInclude): Promise<Swarm> {
    return this.prisma.swarm.create({
      data: swarmCreateInput,
      include: includeClauses
    })
  }

  async update(swarmId: string, swarmUpdateInput: Prisma.SwarmUpdateInput): Promise<Swarm> {
    return this.prisma.swarm.update({
      where: { id: swarmId },
      data: swarmUpdateInput,
    })
  }

  async delete(swarmId: string): Promise<void> {
    await this.prisma.swarm.delete({
      where: { id: swarmId },
    })
  }

  // Additional methods
  async getBasic(swarmId: string): Promise<Swarm> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
    })
  }

  async getWithChats(swarmId: string): Promise<Swarm & { chats: Chat[] }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { chats: true },
    })
  }
}
