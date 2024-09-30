import { AgentGraph, AgentNode, AgentEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractGraphDao } from './AbstractGraphDao'

@injectable()
export class AgentGraphDao extends AbstractGraphDao<
  AgentGraph,
  AgentNode,
  AgentEdge,
  Prisma.AgentGraphCreateInput,
  Prisma.AgentGraphUpdateInput,
  Prisma.AgentGraphInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async get(id: string): Promise<AgentGraph> {
    return this.prisma.agentGraph.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const graph = await this.prisma.agentGraph.findUnique({ where: { id } });
    return graph !== null;
  }

  async create(createInput: Prisma.AgentGraphCreateInput, include?: Prisma.AgentGraphInclude): Promise<AgentGraph> {
    return this.prisma.agentGraph.create({
      data: createInput,
      include: include
    })
  }

  async update(id: string, updateInput: Prisma.AgentGraphUpdateInput): Promise<AgentGraph> {
    return this.prisma.agentGraph.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agentGraph.delete({ where: { id } });
  }

  async getGraph(id: string): Promise<{ nodes: AgentNode[], edges: AgentEdge[] }> {
    const graph = await this.prisma.agentGraph.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!graph) {
      throw new Error(`AgentGraph with id ${id} not found`);
    }

    return {
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }

  async getNodes(id: string): Promise<AgentNode[]> {
    return this.prisma.agentNode.findMany({ where: { agentGraphId: id } });
  }

  async getEdges(id: string): Promise<AgentEdge[]> {
    return this.prisma.agentEdge.findMany({ where: { agentGraphId: id } });
  }
}
