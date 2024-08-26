import { ActionNode, Prisma, PrismaClient, RouteActionContext, SearchContext, PlanContext } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { generateId } from '../../utils/ids'
import { AbstractNodeDao } from './AbstractNodeDao'

export type ActionNodeWithContext = ActionNode & {
  planContext: PlanContext,
  routeActionContext: RouteActionContext,
  searchContext: SearchContext
}

@injectable()
export class ActionDao extends AbstractNodeDao<ActionNode, PrismaClient['actionNode']> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  get model() {
    return this.prisma.actionNode;
  }

  async log(actionId: string, messages: string[]) {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: { logs: { push: messages } },
    })
  }

  async create(swarmId: string, createInput: Omit<Prisma.ActionNodeCreateInput, 'id'>): Promise<ActionNode> {
    const id = await generateId(Prisma.ModelName.ActionNode, swarmId)
    return this.prisma.actionNode.create({
      data: { ...createInput, id },
    })
  }

  async update(actionId: string, actionUpdateInput: Prisma.ActionNodeUpdateInput): Promise<ActionNode> {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }
}