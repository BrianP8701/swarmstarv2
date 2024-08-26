import { ActionMetadataNode, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class ActionMetadataNodeDao extends AbstractNodeDao<ActionMetadataNode, PrismaClient['actionMetadataNode']> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  get model() {
    return this.prisma.actionMetadataNode;
  }

  async get(id: string): Promise<ActionMetadataNode> {
    return this.prisma.actionMetadataNode.findUniqueOrThrow({
      where: { id },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actionMetadataNode.delete({
      where: { id },
    });
  }

  async create(createInput: Prisma.ActionMetadataNodeCreateInput): Promise<ActionMetadataNode> {
    return this.prisma.actionMetadataNode.create({
      data: {
        ...createInput
      },
    });
  }
}