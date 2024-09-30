import { AgentNode, Prisma, PrismaClient, PlanContext, RouteActionContext, SearchContext } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

export type AgentNodeWithContext = AgentNode & {
  planContext: PlanContext | null,
  routeActionContext: RouteActionContext | null,
  searchContext: SearchContext | null
}

@injectable()
export class AgentNodeDao extends AbstractNodeDao<AgentNode, Prisma.AgentNodeCreateInput, Prisma.AgentNodeUpdateInput, Prisma.AgentNodeInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  // CRUD methods
  async get(id: string): Promise<AgentNode> {
    return this.prisma.agentNode.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.agentNode.findUnique({ where: { id } });
    return node !== null;
  }

  async create(createInput: Prisma.AgentNodeCreateInput, includeClauses?: Prisma.AgentNodeInclude): Promise<AgentNode> {
    return this.prisma.agentNode.create({
      data: createInput,
      include: includeClauses
    });
  }

  async update(id: string, updateInput: Prisma.AgentNodeUpdateInput): Promise<AgentNode> {
    return this.prisma.agentNode.update({
      where: { id },
      data: updateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agentNode.delete({
      where: { id },
    });
  }

  // Node DAO methods
  async getOutgoingNodes(nodeId: string): Promise<AgentNode[]> {
    const edges = await this.prisma.agentEdge.findMany({
      where: { startNodeId: nodeId },
      include: { endNode: true },
    });
    return edges.map(edge => edge.endNode);
  }

  async getIncomingNodes(nodeId: string): Promise<AgentNode[]> {
    const edges = await this.prisma.agentEdge.findMany({
      where: { endNodeId: nodeId },
      include: { startNode: true },
    });
    return edges.map(edge => edge.startNode);
  }

  async getAllConnectedNodes(nodeId: string): Promise<AgentNode[]> {
    const outgoing = await this.getOutgoingNodes(nodeId);
    const incoming = await this.getIncomingNodes(nodeId);
    return [...outgoing, ...incoming];
  }

  async log(actionId: string, messages: string[]) {
    return this.prisma.agentNode.update({
      where: { id: actionId },
      data: { logs: { push: messages } },
    })
  }

  async getWithContext(id: string): Promise<AgentNodeWithContext> {
    return this.prisma.agentNode.findUniqueOrThrow({
      where: { id },
      include: {
        planContext: true,
        routeActionContext: true,
        searchContext: true,
      },
    });
  }
}
