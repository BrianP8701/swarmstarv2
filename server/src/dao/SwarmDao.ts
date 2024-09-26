import { Chat, Memory, Prisma, PrismaClient, Swarm, ActionNode, MemoryNode, ActionMetadataNode } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class SwarmDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async create(swarmCreateInput: Prisma.SwarmCreateInput) {
    return this.prisma.swarm.create({
      data: swarmCreateInput,
    })
  }

  async update(swarmId: string, swarmUpdateInput: Prisma.SwarmUpdateInput) {
    return this.prisma.swarm.update({
      where: { id: swarmId },
      data: swarmUpdateInput,
    })
  }

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

  async getWithMemory(swarmId: string): Promise<Swarm & { memory: Memory }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { memory: true },
    })
  }

  async getWithActionNodes(swarmId: string): Promise<Swarm & { actionNodes: ActionNode[] }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { actionNodes: true },
    })
  }

  async getWithMemoryNodes(swarmId: string): Promise<Swarm & { memory: Memory & { memoryNodes: MemoryNode[] } }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { 
        memory: { 
          include: { 
            memoryNodes: true 
          } 
        } 
      },
    })
  }

  async getWithActionMetadata(swarmId: string): Promise<Swarm & { actionMetadataNodes: ActionMetadataNode[] }> {
    return this.prisma.swarm.findUniqueOrThrow({
      where: { id: swarmId },
      include: { actionMetadataNodes: true },
    })
  }

  async delete(swarmId: string) {
    return this.prisma.swarm.delete({
      where: { id: swarmId },
    })
  }
}
