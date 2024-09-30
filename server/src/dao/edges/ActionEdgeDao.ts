import { ActionEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractEdgeDao } from './AbstractEdgeDao'

@injectable()
export class ActionEdgeDao extends AbstractEdgeDao<
  ActionEdge,
  Prisma.ActionEdgeCreateInput,
  Prisma.ActionEdgeUpdateInput,
  Prisma.ActionEdgeInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<ActionEdge> {
    return this.prisma.actionEdge.findUniqueOrThrow({ where: { id } })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.actionEdge.findUnique({ where: { id } })
    return node !== null
  }

  async create(
    createInput: Prisma.ActionEdgeCreateInput,
    includeClauses?: Prisma.ActionEdgeInclude
  ): Promise<ActionEdge> {
    return this.prisma.actionEdge.create({
      data: createInput,
      include: includeClauses,
    })
  }

  async update(actionId: string, actionUpdateInput: Prisma.ActionEdgeUpdateInput): Promise<ActionEdge> {
    return this.prisma.actionEdge.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actionEdge.delete({ where: { id } })
  }

  // Edge DAO methods
  async getEdge(id: string): Promise<ActionEdge> {
    return this.prisma.actionEdge.findUniqueOrThrow({ where: { id } })
  }

  async getOutgoingEdges(nodeId: string): Promise<ActionEdge[]> {
    return this.prisma.actionEdge.findMany({
      where: { startNodeId: nodeId },
    })
  }

  async getIncomingEdges(nodeId: string): Promise<ActionEdge[]> {
    return this.prisma.actionEdge.findMany({
      where: { endNodeId: nodeId },
    })
  }

  async getAllConnectedEdges(nodeId: string): Promise<ActionEdge[]> {
    const outgoing = await this.getOutgoingEdges(nodeId)
    const incoming = await this.getIncomingEdges(nodeId)
    return [...outgoing, ...incoming]
  }
}
