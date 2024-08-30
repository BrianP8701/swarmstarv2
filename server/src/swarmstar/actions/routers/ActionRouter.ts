import { injectable, inject } from 'inversify';
import { AbstractRouter, RouterStatusEnum } from './AbstractRouter';
import { ActionEnum, ActionMetadataNode, RouteActionContext } from '@prisma/client';
import { ActionMetadataNodeDao } from '../../../dao/nodes/ActionMetadataDao';
import { ActionNodeWithContext } from '../../../dao/nodes/ActionDao';
import { container } from '../../../utils/di/container';

@injectable()
export class ActionRouter extends AbstractRouter<
  ActionMetadataNode,
  ActionMetadataNodeDao,
  RouteActionContext
> {
  static readonly description = "Find the most appropriate action based on the current context and goal.";
  static readonly actionEnum = ActionEnum.ROUTE_ACTION;

  readonly description = ActionRouter.description;
  readonly actionEnum = ActionRouter.actionEnum;

  static systemPrompt = "You are an AI assistant helping to navigate through a tree of actions. Choose the most appropriate action based on the current context and goal.";

  constructor(@inject('ActionNode') actionNode: ActionNodeWithContext) {
    super(actionNode);
  }

  protected getNodeDao(): ActionMetadataNodeDao {
    return container.get(ActionMetadataNodeDao);
  }

  protected getContext(): RouteActionContext {
    return this.actionNode.routeActionContext;
  }

  async getStartNode(): Promise<ActionMetadataNode> {
    if (this.context.startNodeId) {
      return await this.nodeDao.get(this.context.startNodeId);
    }
    return await this.nodeDao.get(this.actionNode.swarmId);
  }

  async handleNoChildren(node: ActionMetadataNode): Promise<[RouterStatusEnum, ActionMetadataNode]> {
    return [RouterStatusEnum.SUCCESS, node];
  }

  async handleSuccess(node: ActionMetadataNode): Promise<void> {
    await this.actionDao.create({
      actionEnum: node.actionEnum,
      goal: this.context.content,
      swarm: { connect: { id: this.actionNode.swarmId } }
    });
  }

  async treeLevelFallback(): Promise<void> {
    throw new Error("ActionRouter does not support tree level fallback");
  }
}
