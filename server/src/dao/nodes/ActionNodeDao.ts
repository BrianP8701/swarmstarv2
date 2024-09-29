import { ActionNode, Prisma, PrismaClient, ActionNodeEdge } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao';

@injectable()
export class ActionNodeDao extends AbstractNodeDao<ActionNode, ActionNodeEdge, Prisma.ActionNodeCreateInput, Prisma.ActionNodeUpdateInput, Prisma.ActionNodeEdgeCreateInput, Prisma.ActionNodeEdgeUpdateInput, Prisma.ActionNodeInclude, Prisma.ActionNodeEdgeInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  // CRUD methods
  async get(id: string): Promise<ActionNode> {
    return this.prisma.actionNode.findUniqueOrThrow({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.actionNode.findUnique({ where: { id } });
    return node !== null;
  }

  async create(createInput: Prisma.ActionNodeCreateInput, includeClauses?: Prisma.ActionNodeInclude): Promise<ActionNode> {
    return this.prisma.actionNode.create({
      data: createInput,
      include: includeClauses
    })
  }

  async update(actionId: string, actionUpdateInput: Prisma.ActionNodeUpdateInput): Promise<ActionNode> {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actionNode.delete({ where: { id } });
  }

  // Node DAO methods
  async getEdge(id: string): Promise<ActionNodeEdge> {
    return this.prisma.actionNodeEdge.findUniqueOrThrow({ where: { id } });
  }

  async getOutgoingNodes(nodeId: string): Promise<ActionNode[]> {
    const edges = await this.prisma.actionNodeEdge.findMany({
      where: { startNodeId: nodeId },
      include: { endNode: true },
    });
    return edges.map(edge => edge.endNode);
  }

  async getIncomingNodes(nodeId: string): Promise<ActionNode[]> {
    const edges = await this.prisma.actionNodeEdge.findMany({
      where: { endNodeId: nodeId },
      include: { startNode: true },
    });
    return edges.map(edge => edge.startNode);
  }

  async getOutgoingEdges(nodeId: string): Promise<ActionNodeEdge[]> {
    return this.prisma.actionNodeEdge.findMany({
      where: { startNodeId: nodeId },
    });
  }

  async getIncomingEdges(nodeId: string): Promise<ActionNodeEdge[]> {
    return this.prisma.actionNodeEdge.findMany({
      where: { endNodeId: nodeId },
    });
  }

  async getAllConnectedNodes(nodeId: string): Promise<ActionNode[]> {
    const outgoing = await this.getOutgoingNodes(nodeId);
    const incoming = await this.getIncomingNodes(nodeId);
    return [...outgoing, ...incoming];
  }

  async getAllConnectedEdges(nodeId: string): Promise<ActionNodeEdge[]> {
    const outgoing = await this.getOutgoingEdges(nodeId);
    const incoming = await this.getIncomingEdges(nodeId);
    return [...outgoing, ...incoming];
  }

  async nodeExists(id: string): Promise<boolean> {
    return this.exists(id);
  }

  async edgeExists(id: string): Promise<boolean> {
    const edge = await this.prisma.actionNodeEdge.findUnique({ where: { id } });
    return edge !== null;
  }

  async createEdge(createInput: Prisma.ActionNodeEdgeCreateInput, includeClauses?: Prisma.ActionNodeEdgeInclude): Promise<ActionNodeEdge> {
    return this.prisma.actionNodeEdge.create({
      data: createInput,
      include: includeClauses
    });
  }

  async updateEdge(id: string, updateInput: Prisma.ActionNodeEdgeUpdateInput): Promise<ActionNodeEdge> {
    return this.prisma.actionNodeEdge.update({
      where: { id },
      data: updateInput,
    });
  }
}