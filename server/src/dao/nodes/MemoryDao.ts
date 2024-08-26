import { MemoryNode, PrismaClient } from '@prisma/client'
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
}
