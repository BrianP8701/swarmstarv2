import { injectable, inject } from 'inversify'
import { AbstractRouter, RouterStatusEnum } from './AbstractRouter'
import { ActionEnum, ActionNode, RouteActionContext } from '@prisma/client'
import { ActionNodeDao } from '../../../dao/nodes/ActionNodeDao'
import { AgentNodeWithContext } from '../../../dao/nodes/AgentNodeDao'
import { container } from '../../../utils/di/container'
import { GlobalContextDao } from '../../../dao/GlobalContextDao'

@injectable()
export class ActionRouter extends AbstractRouter<ActionNode, ActionNodeDao, RouteActionContext> {
  static readonly description = 'Find the most appropriate action based on the current context and goal.'
  static readonly actionEnum = ActionEnum.ROUTE_ACTION

  readonly description = ActionRouter.description
  readonly actionEnum = ActionRouter.actionEnum

  static get systemPrompt() {
    return 'You are an AI assistant helping to navigate through a tree of actions. Choose the most appropriate action based on the current context and goal.'
  }

  protected async getContext(): Promise<RouteActionContext> {
    const agentWithContext = await this.agentNodeDao.getWithContext(this.agentNode.id)
    const routeActionContext = agentWithContext.routeActionContext
    if (!routeActionContext) {
      throw new Error('Route action context not found')
    }
    return routeActionContext
  }

  constructor(
    @inject('AgentNode') agentNode: AgentNodeWithContext,
    @inject(GlobalContextDao) private globalContextDao: GlobalContextDao
  ) {
    super(agentNode)
  }

  protected getNodeDao(): ActionNodeDao {
    return container.get(ActionNodeDao)
  }

  async getStartNode(): Promise<ActionNode> {
    const globalContext = await this.globalContextDao.get()
    return await this.nodeDao.get(globalContext.rootActionNodeId)
  }

  async handleNoChildren(node: ActionNode): Promise<[RouterStatusEnum, ActionNode]> {
    return [RouterStatusEnum.SUCCESS, node]
  }

  async handleSuccess(node: ActionNode): Promise<void> {
    await this.agentNodeDao.create({
      actionEnum: node.actionEnum,
      goal: (await this.getContext()).content,
      agentGraph: { connect: { id: this.agentNode.agentGraphId } },
    })
  }

  async treeLevelFallback(): Promise<void> {
    throw new Error('ActionRouter does not support tree level fallback')
  }
}
