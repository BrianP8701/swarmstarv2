import { InformationNode, InformationNodeEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class InformationNodeDao extends AbstractNodeDao<InformationNode, InformationNodeEdge, Prisma.InformationNodeCreateInput, Prisma.InformationNodeUpdateInput, Prisma.InformationNodeEdgeCreateInput, Prisma.InformationNodeEdgeUpdateInput, Prisma.InformationNodeInclude, Prisma.InformationNodeEdgeInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  // CRUD methods
  async get(informationId: string): Promise<InformationNode> {
    return this.prisma.informationNode.findUniqueOrThrow({
      where: {
        id: informationId,
      },
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.informationNode.findUnique({ where: { id } });
    return node !== null;
  }

  public async create(createInput: Prisma.InformationNodeCreateInput, includeClauses?: Prisma.InformationNodeInclude): Promise<InformationNode> {
    const information = await this.prisma.informationNode.create({
      data: createInput,
      include: includeClauses
    })

    return information
  }

  async update(id: string, updateInput: Prisma.InformationNodeUpdateInput): Promise<InformationNode> {
    return this.prisma.informationNode.update({
      where: { id },
      data: updateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.informationNode.delete({ where: { id } });
  }

  // Node DAO methods
  async getEdge(id: string): Promise<InformationNodeEdge> {
    return this.prisma.informationNodeEdge.findUniqueOrThrow({ where: { id } });
  }

  async getOutgoingNodes(nodeId: string): Promise<InformationNode[]> {
    const edges = await this.prisma.informationNodeEdge.findMany({
      where: { startNodeId: nodeId },
      include: { endNode: true },
    });
    return edges.map(edge => edge.endNode);
  }

  async getIncomingNodes(nodeId: string): Promise<InformationNode[]> {
    const edges = await this.prisma.informationNodeEdge.findMany({
      where: { endNodeId: nodeId },
      include: { startNode: true },
    });
    return edges.map(edge => edge.startNode);
  }

  async getOutgoingEdges(nodeId: string): Promise<InformationNodeEdge[]> {
    return this.prisma.informationNodeEdge.findMany({
      where: { startNodeId: nodeId },
    });
  }

  async getIncomingEdges(nodeId: string): Promise<InformationNodeEdge[]> {
    return this.prisma.informationNodeEdge.findMany({
      where: { endNodeId: nodeId },
    });
  }

  async getAllConnectedNodes(nodeId: string): Promise<InformationNode[]> {
    const outgoing = await this.getOutgoingNodes(nodeId);
    const incoming = await this.getIncomingNodes(nodeId);
    return [...outgoing, ...incoming];
  }

  async getAllConnectedEdges(nodeId: string): Promise<InformationNodeEdge[]> {
    const outgoing = await this.getOutgoingEdges(nodeId);
    const incoming = await this.getIncomingEdges(nodeId);
    return [...outgoing, ...incoming];
  }

  async nodeExists(id: string): Promise<boolean> {
    return this.exists(id);
  }

  async edgeExists(id: string): Promise<boolean> {
    const edge = await this.prisma.informationNodeEdge.findUnique({ where: { id } });
    return edge !== null;
  }

  public async createEdge(createInput: Prisma.InformationNodeEdgeCreateInput): Promise<InformationNodeEdge> {
    return this.prisma.informationNodeEdge.create({
      data: createInput
    })
  }

  async updateEdge(id: string, updateInput: Prisma.InformationNodeEdgeUpdateInput): Promise<InformationNodeEdge> {
    return this.prisma.informationNodeEdge.update({
      where: { id },
      data: updateInput,
    });
  }
}