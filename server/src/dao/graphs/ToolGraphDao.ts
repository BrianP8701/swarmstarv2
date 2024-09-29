import { ToolGraph, ToolNode, ToolNodeEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractGraphDao } from './AbstractGraphDao'

@injectable()
export class ToolGraphDao extends AbstractGraphDao<
  ToolGraph,
  ToolNode,
  ToolNodeEdge,
  Prisma.ToolGraphCreateInput,
  Prisma.ToolGraphUpdateInput,
  Prisma.ToolGraphInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async get(id: string): Promise<ToolGraph> {
    return this.prisma.toolGraph.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const graph = await this.prisma.toolGraph.findUnique({ where: { id } });
    return graph !== null;
  }

  async create(createInput: Prisma.ToolGraphCreateInput, include?: Prisma.ToolGraphInclude): Promise<ToolGraph> {
    return this.prisma.toolGraph.create({
      data: createInput,
      include: include
    })
  }

  async update(id: string, updateInput: Prisma.ToolGraphUpdateInput): Promise<ToolGraph> {
    return this.prisma.toolGraph.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.toolGraph.delete({ where: { id } });
  }

  async getGraph(id: string): Promise<{ nodes: ToolNode[], edges: ToolNodeEdge[] }> {
    const graph = await this.prisma.toolGraph.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!graph) {
      throw new Error(`ToolGraph with id ${id} not found`);
    }

    return {
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }

  async getNodes(id: string): Promise<ToolNode[]> {
    return this.prisma.toolNode.findMany({ where: { toolGraphId: id } });
  }

  async getEdges(id: string): Promise<ToolNodeEdge[]> {
    return this.prisma.toolNodeEdge.findMany({ where: { toolGraphId: id } });
  }
}
