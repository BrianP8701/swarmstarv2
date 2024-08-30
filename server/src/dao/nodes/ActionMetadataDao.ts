import { ActionMetadataNode, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class ActionMetadataNodeDao extends AbstractNodeDao<ActionMetadataNode, ActionMetadataNode> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
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
      data: createInput
    });
  }

  async getAll(swarmId: string): Promise<ActionMetadataNode[]> {
    return this.prisma.actionMetadataNode.findMany({
      where: {
        swarmId,
      },
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.actionMetadataNode.findUnique({ where: { id } });
    return node !== null;
  }

  async getChildren(nodeId: string): Promise<ActionMetadataNode[]> {
    return this.prisma.actionMetadataNode.findMany({ where: { parentId: nodeId } });
  }

  async getParent(nodeId: string): Promise<ActionMetadataNode | null> {
    const node = await this.prisma.actionMetadataNode.findUnique({
      where: { id: nodeId },
      include: { parent: true }
    });
    return node?.parent || null;
  }
}