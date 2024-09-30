import { ActionNode, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class ActionNodeDao extends AbstractNodeDao<
  ActionNode,
  Prisma.ActionNodeCreateInput,
  Prisma.ActionNodeUpdateInput,
  Prisma.ActionNodeInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<ActionNode> {
    return this.prisma.actionNode.findUniqueOrThrow({ where: { id } })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.actionNode.findUnique({ where: { id } })
    return node !== null
  }

  async create(
    createInput: Prisma.ActionNodeCreateInput,
    includeClauses?: Prisma.ActionNodeInclude
  ): Promise<ActionNode> {
    return this.prisma.actionNode.create({
      data: createInput,
      include: includeClauses,
    })
  }

  async update(actionId: string, actionUpdateInput: Prisma.ActionNodeUpdateInput): Promise<ActionNode> {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actionNode.delete({ where: { id } })
  }

  // Node DAO methods
  async getOutgoingNodes(nodeId: string): Promise<ActionNode[]> {
    const edges = await this.prisma.actionEdge.findMany({
      where: { startNodeId: nodeId },
      include: { endNode: true },
    })
    return edges.map(edge => edge.endNode)
  }

  async getIncomingNodes(nodeId: string): Promise<ActionNode[]> {
    const edges = await this.prisma.actionEdge.findMany({
      where: { endNodeId: nodeId },
      include: { startNode: true },
    })
    return edges.map(edge => edge.startNode)
  }

  async getAllConnectedNodes(nodeId: string): Promise<ActionNode[]> {
    const outgoing = await this.getOutgoingNodes(nodeId)
    const incoming = await this.getIncomingNodes(nodeId)
    return [...outgoing, ...incoming]
  }
}
