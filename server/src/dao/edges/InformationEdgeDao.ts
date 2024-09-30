import { InformationEdge, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractEdgeDao } from './AbstractEdgeDao'

@injectable()
export class InformationEdgeDao extends AbstractEdgeDao<InformationEdge, Prisma.InformationEdgeCreateInput, Prisma.InformationEdgeUpdateInput, Prisma.InformationEdgeInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  // CRUD methods
  async get(informationId: string): Promise<InformationEdge> {
    return this.prisma.informationEdge.findUniqueOrThrow({
      where: {
        id: informationId,
      },
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.informationEdge.findUnique({ where: { id } });
    return node !== null;
  }

  public async create(createInput: Prisma.InformationEdgeCreateInput, includeClauses?: Prisma.InformationEdgeInclude): Promise<InformationEdge> {
    const information = await this.prisma.informationEdge.create({
      data: createInput,
      include: includeClauses
    })

    return information
  }

  async update(id: string, updateInput: Prisma.InformationEdgeUpdateInput): Promise<InformationEdge> {
    return this.prisma.informationEdge.update({
      where: { id },
      data: updateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.informationEdge.delete({ where: { id } });
  }

  // Edge DAO methods
  async getOutgoingEdges(nodeId: string): Promise<InformationEdge[]> {
    return this.prisma.informationEdge.findMany({
      where: { startNodeId: nodeId },
    });
  }

  async getIncomingEdges(nodeId: string): Promise<InformationEdge[]> {
    return this.prisma.informationEdge.findMany({
      where: { endNodeId: nodeId },
    });
  }

  async getAllConnectedEdges(nodeId: string): Promise<InformationEdge[]> {
    const outgoing = await this.getOutgoingEdges(nodeId);
    const incoming = await this.getIncomingEdges(nodeId);
    return [...outgoing, ...incoming];
  }
}