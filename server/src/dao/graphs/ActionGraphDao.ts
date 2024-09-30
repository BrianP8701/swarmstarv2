import { ActionGraph, ActionNode, ActionEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractGraphDao } from './AbstractGraphDao'

@injectable()
export class ActionGraphDao extends AbstractGraphDao<
  ActionGraph,
  ActionNode,
  ActionEdge,
  Prisma.ActionGraphCreateInput,
  Prisma.ActionGraphUpdateInput,
  Prisma.ActionGraphInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async get(id: string): Promise<ActionGraph> {
    return this.prisma.actionGraph.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const graph = await this.prisma.actionGraph.findUnique({ where: { id } });
    return graph !== null;
  }

  async create(createInput: Prisma.ActionGraphCreateInput, include?: Prisma.ActionGraphInclude): Promise<ActionGraph> {
    return this.prisma.actionGraph.create({
      data: createInput,
      include: include
    })
  }

  async update(id: string, updateInput: Prisma.ActionGraphUpdateInput): Promise<ActionGraph> {
    return this.prisma.actionGraph.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actionGraph.delete({ where: { id } });
  }

  async getGraph(id: string): Promise<{ nodes: ActionNode[], edges: ActionEdge[] }> {
    const graph = await this.prisma.actionGraph.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!graph) {
      throw new Error(`ActionGraph with id ${id} not found`);
    }

    return {
      nodes: graph.nodes,
      edges: graph.edges,
    };
  }

  async getNodes(id: string): Promise<ActionNode[]> {
    return this.prisma.actionNode.findMany({ where: { actionGraphId: id } });
  }

  async getEdges(id: string): Promise<ActionEdge[]> {
    return this.prisma.actionEdge.findMany({ where: { actionGraphId: id } });
  }
}
