import { Memory, MemoryNode, MemoryTypeEnum, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class MemoryDao extends AbstractNodeDao<MemoryNode, MemoryNode> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.memoryNode.findUnique({ where: { id } });
    return node !== null;
  }

  async getChildren(nodeId: string): Promise<MemoryNode[]> {
    return this.prisma.memoryNode.findMany({ where: { parentId: nodeId } });
  }

  async getParent(nodeId: string): Promise<MemoryNode | null> {
    const node = await this.prisma.memoryNode.findUnique({
      where: { id: nodeId },
      include: { parent: true }
    });
    return node?.parent || null;
  }

  public async createMemory(userId: string, title: string): Promise<Memory> {
    const memory = await this.prisma.memory.create({
      data: {
        title,
        userId,
      },
    })

    await this.prisma.memoryNode.create({
      data: {
        description: `Root folder of ${memory.title}`,
        memoryId: memory.id,
        title: memory.title,
        memoryType: MemoryTypeEnum.FOLDER
      },
    })

    return memory
  }

  public async get(memoryId: string): Promise<Memory> {
    return this.prisma.memory.findUniqueOrThrow({
      where: {
        id: memoryId,
      },
    })
  }

  async getAll(memoryId: string): Promise<MemoryNode[]> {
    return this.prisma.memoryNode.findMany({
      where: {
        memoryId: memoryId,
      },
    })
  }

  public async getMemoryCount(memoryId: string): Promise<number> {
    return this.prisma.memoryNode.count({
      where: {
        memoryId,
      },
    })
  }
}
