import { AgentEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractEdgeDao } from './AbstractEdgeDao'

@injectable()
export class AgentEdgeDao extends AbstractEdgeDao<
  AgentEdge,
  Prisma.AgentEdgeCreateInput,
  Prisma.AgentEdgeUpdateInput,
  Prisma.AgentEdgeInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<AgentEdge> {
    return this.prisma.agentEdge.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.agentEdge.findUnique({ where: { id } })
    return node !== null
  }

  async create(createInput: Prisma.AgentEdgeCreateInput, includeClauses?: Prisma.AgentEdgeInclude): Promise<AgentEdge> {
    return this.prisma.agentEdge.create({
      data: createInput,
      include: includeClauses,
    })
  }

  async update(id: string, updateInput: Prisma.AgentEdgeUpdateInput): Promise<AgentEdge> {
    return this.prisma.agentEdge.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agentEdge.delete({
      where: { id },
    })
  }

  // Edge DAO methods
  async getOutgoingEdges(nodeId: string): Promise<AgentEdge[]> {
    return this.prisma.agentEdge.findMany({
      where: { startNodeId: nodeId },
    })
  }

  async getIncomingEdges(nodeId: string): Promise<AgentEdge[]> {
    return this.prisma.agentEdge.findMany({
      where: { endNodeId: nodeId },
    })
  }

  async getAllConnectedEdges(nodeId: string): Promise<AgentEdge[]> {
    const outgoing = await this.getOutgoingEdges(nodeId)
    const incoming = await this.getIncomingEdges(nodeId)
    return [...outgoing, ...incoming]
  }
}
