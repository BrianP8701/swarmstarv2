import { InformationNode, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

@injectable()
export class InformationNodeDao extends AbstractNodeDao<InformationNode, Prisma.InformationNodeCreateInput, Prisma.InformationNodeUpdateInput, Prisma.InformationNodeInclude> {
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
  async getOutgoingNodes(nodeId: string): Promise<InformationNode[]> {
    const edges = await this.prisma.informationEdge.findMany({
      where: { startNodeId: nodeId },
      include: { endNode: true },
    });
    return edges.map(edge => edge.endNode);
  }

  async getIncomingNodes(nodeId: string): Promise<InformationNode[]> {
    const edges = await this.prisma.informationEdge.findMany({
      where: { endNodeId: nodeId },
      include: { startNode: true },
    });
    return edges.map(edge => edge.startNode);
  }

  async getAllConnectedNodes(nodeId: string): Promise<InformationNode[]> {
    const outgoing = await this.getOutgoingNodes(nodeId);
    const incoming = await this.getIncomingNodes(nodeId);
    return [...outgoing, ...incoming];
  }
}