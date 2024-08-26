import { ToolMetadataNode, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class ToolMetadataNodeDao extends AbstractNodeDao<ToolMetadataNode, PrismaClient['toolMetadataNode']> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  get model() {
    return this.prisma.toolMetadataNode;
  }
}
