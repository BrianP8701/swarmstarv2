import { ActionNode, Prisma, PrismaClient, RouteActionContext, SearchContext, PlanContext } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractNodeDao } from './AbstractNodeDao'

export type ActionNodeWithContext = ActionNode & {
  planContext: PlanContext,
  routeActionContext: RouteActionContext,
  searchContext: SearchContext
}

@injectable()
export class ActionDao extends AbstractNodeDao<ActionNode, ActionNode> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async log(actionId: string, messages: string[]) {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: { logs: { push: messages } },
    })
  }

  async create(createInput: Prisma.ActionNodeCreateInput): Promise<ActionNode> {
    return this.prisma.actionNode.create({
      data: createInput
    })
  }

  async update(actionId: string, actionUpdateInput: Prisma.ActionNodeUpdateInput): Promise<ActionNode> {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }

  async exists(id: string): Promise<boolean> {
    const node = await this.prisma.actionNode.findUnique({ where: { id } });
    return node !== null;
  }

  async getChildren(nodeId: string): Promise<ActionNode[]> {
    return this.prisma.actionNode.findMany({ where: { parentId: nodeId } });
  }

  async getParent(nodeId: string): Promise<ActionNode | null> {
    const node = await this.prisma.actionNode.findUnique({
      where: { id: nodeId },
      include: { parent: true }
    });
    return node?.parent || null;
  }
}