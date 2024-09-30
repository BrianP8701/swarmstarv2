import { InformationGraph, InformationNode, InformationEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractGraphDao } from './AbstractGraphDao'

@injectable()
export class InformationGraphDao extends AbstractGraphDao<
  InformationGraph,
  InformationNode,
  InformationEdge,
  Prisma.InformationGraphCreateInput,
  Prisma.InformationGraphUpdateInput,
  Prisma.InformationGraphInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  async get(id: string): Promise<InformationGraph> {
    return this.prisma.informationGraph.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const graph = await this.prisma.informationGraph.findUnique({ where: { id } })
    return graph !== null
  }

  async create(
    createInput: Prisma.InformationGraphCreateInput,
    include?: Prisma.InformationGraphInclude
  ): Promise<InformationGraph> {
    return this.prisma.informationGraph.create({
      data: createInput,
      include: include,
    })
  }

  async update(id: string, updateInput: Prisma.InformationGraphUpdateInput): Promise<InformationGraph> {
    return this.prisma.informationGraph.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.informationGraph.delete({ where: { id } })
  }

  async getGraph(id: string): Promise<{ nodes: InformationNode[]; edges: InformationEdge[] }> {
    const graph = await this.prisma.informationGraph.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    })

    if (!graph) {
      throw new Error(`InformationGraph with id ${id} not found`)
    }

    return {
      nodes: graph.nodes,
      edges: graph.edges,
    }
  }

  // Additional methods specific to InformationGraph if needed
  async getByUserId(userId: string): Promise<InformationGraph[]> {
    return this.prisma.informationGraph.findMany({
      where: { userId },
    })
  }

  async getNodes(id: string): Promise<InformationNode[]> {
    return this.prisma.informationNode.findMany({ where: { informationGraphId: id } })
  }

  async getEdges(id: string): Promise<InformationEdge[]> {
    return this.prisma.informationEdge.findMany({ where: { informationGraphId: id } })
  }
}
