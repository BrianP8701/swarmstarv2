import { injectable } from 'inversify';
import { AbstractAction, AgentContext } from '../AbstractAction';
import { RouterInstructor } from '../../instructors/RouterInstructor';
import { container } from '../../../utils/di/container';
import { AbstractNodeDao } from '../../../dao/nodes/AbstractNodeDao';
import { AgentNodeWithContext } from '../../../dao/nodes/AgentNodeDao';

export enum RouterStatusEnum {
  SEARCHING,
  NO_VIABLE_OPTIONS,
  NO_CHILDREN,
  SUCCESS,
  FAILURE
}

type RouterContext = AgentContext & {
  content: string;
  markedNodeIds: string[];
}

// Define an interface for the minimum requirements of T
interface RouterNode {
  id: string;
  description: string;
}
 
@injectable()
export abstract class AbstractRouter<
  T extends RouterNode,
  D extends AbstractNodeDao<T, unknown, unknown, unknown, unknown, unknown, unknown, unknown>,
  C extends RouterContext,
> extends AbstractAction<C> {
  protected routerInstructor: RouterInstructor;
  protected nodeDao: D;

  static get systemPrompt(): string {
    throw new Error('systemPrompt must be implemented in derived class');
  }

  constructor(agentNode: AgentNodeWithContext) {
    super(agentNode);
    this.routerInstructor = container.get(RouterInstructor);
    this.nodeDao = this.getNodeDao();
  }

  protected abstract getNodeDao(): D;

  abstract getStartNode(): Promise<T>;
  abstract handleNoChildren(node: T): Promise<[RouterStatusEnum, T]>;
  abstract handleSuccess(node: T): Promise<void>;
  abstract treeLevelFallback(): Promise<void>;

  async run(): Promise<void> {
    let node: T = await this.getStartNode();
    let status = RouterStatusEnum.SEARCHING;

    while (true) {
      switch (status) {
        case RouterStatusEnum.SUCCESS:
          return await this.handleSuccess(node);
        case RouterStatusEnum.NO_VIABLE_OPTIONS:
          [status, node] = await this.backtrack(node);
          break;
        case RouterStatusEnum.SEARCHING:
          [status, node] = await this.search(node);
          break;
        case RouterStatusEnum.NO_CHILDREN:
          [status, node] = await this.handleNoChildren(node);
          break;
        case RouterStatusEnum.FAILURE:
          return await this.treeLevelFallback();
        default:
          throw new Error(`Invalid router status: ${status}`);
      }
    }
  }

  private async search(node: T): Promise<[RouterStatusEnum, T]> {
    const children = await this.nodeDao.getOutgoingNodes(node.id);
    if (children.length === 0) {
      return [RouterStatusEnum.NO_CHILDREN, node];
    }
    if (children.length === 1) {
      return this.singleChildSearch(children[0]);
    }
    return this.multipleChildrenSearch(node, children);
  }

  private async singleChildSearch(child: T): Promise<[RouterStatusEnum, T]> {
    const context = await this.getContext();
    context.markedNodeIds.push(child.id);
    return [RouterStatusEnum.SEARCHING, child];
  }

  private async multipleChildrenSearch(node: T, children: T[]): Promise<[RouterStatusEnum, T]> {
    const viableChildren = await this.removeUnviableNodes(children);
    if (viableChildren.length === 0) {
      return [RouterStatusEnum.NO_VIABLE_OPTIONS, node];
    }

    const context = await this.getContext();
    const routerResponse = await this.routerInstructor.run(
      {
        options: viableChildren.map(child => child.description),
        content: context.content,
        systemMessage: (this.constructor as unknown as typeof AbstractRouter<T, D, C>).systemPrompt,
      },
      this.agentNode.id
    );

    if (routerResponse.bestOption !== null) {
      await this.markUnviableNodes(children, routerResponse.unviableOptions);
      const selectedNode = viableChildren[routerResponse.bestOption];
      context.markedNodeIds.push(selectedNode.id);
      return [RouterStatusEnum.SEARCHING, selectedNode];
    }

    await this.markUnviableNodes(children, children.map((_, index) => index));
    return [RouterStatusEnum.NO_VIABLE_OPTIONS, node];
  }

  private async markUnviableNodes(children: T[], unviableOptions: number[]): Promise<void> {
    const context = await this.getContext();
    context.markedNodeIds.push(...unviableOptions.map(index => children[index].id));
  }

  private async removeUnviableNodes(children: T[]): Promise<T[]> {
    const context = await this.getContext();
    return children.filter(child => !context.markedNodeIds.includes(child.id));
  }

  private async backtrack(node: T): Promise<[RouterStatusEnum, T]> {
    while (true) {
      const parentNodes = await this.nodeDao.getIncomingNodes(node.id)
      if (parentNodes.length > 0) {
        node = parentNodes[0] as T; // Type assertion needed here
        const context = await this.getContext();
        context.markedNodeIds.push(node.id);
        const children = await this.nodeDao.getOutgoingNodes(node.id);
        const filteredChildren = await this.removeUnviableNodes(children);
        if (filteredChildren.length > 0) {
          return [RouterStatusEnum.SEARCHING, node];
        }
      } else {
        return [RouterStatusEnum.FAILURE, node];
      }
    }
  }
}