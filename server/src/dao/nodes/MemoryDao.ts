import { Memory, MemoryNode, MemoryTypeEnum, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class MemoryDao extends AbstractNodeDao<MemoryNode, PrismaClient['memoryNode']> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  get model() {
    return this.prisma.memoryNode;
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

  public async getMemoryCount(memoryId: string): Promise<number> {
    return this.prisma.memoryNode.count({
      where: {
        memoryId,
      },
    })
  }
}
