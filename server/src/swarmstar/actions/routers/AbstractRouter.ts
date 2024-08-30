import { injectable } from 'inversify';
import { AbstractAction, ActionContext } from '../AbstractAction';
import { RouterInstructor } from '../../instructors/RouterInstructor';
import { container } from '../../../utils/di/container';
import { AbstractNodeDao } from '../../../dao/nodes/AbstractNodeDao';
import { ActionNodeWithContext } from '../../../dao/nodes/ActionDao';

export enum RouterStatusEnum {
  SEARCHING,
  NO_VIABLE_OPTIONS,
  NO_CHILDREN,
  SUCCESS,
  FAILURE
}

type RouterContext = ActionContext & {
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
  D extends AbstractNodeDao<T, T>,
  C extends RouterContext
> extends AbstractAction<C> {
  protected routerInstructor: RouterInstructor;
  protected nodeDao: D;

  static get systemPrompt(): string {
    throw new Error('systemPrompt must be implemented in derived class');
  }

  constructor(actionNode: ActionNodeWithContext) {
    super(actionNode);
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
    const children = await this.nodeDao.getChildren(node.id);
    if (children.length === 0) {
      return [RouterStatusEnum.NO_CHILDREN, node];
    }
    if (children.length === 1) {
      return this.singleChildSearch(children[0]);
    }
    return this.multipleChildrenSearch(node, children);
  }

  private singleChildSearch(child: T): [RouterStatusEnum, T] {
    this.context.markedNodeIds.push(child.id);
    return [RouterStatusEnum.SEARCHING, child];
  }

  private async multipleChildrenSearch(node: T, children: T[]): Promise<[RouterStatusEnum, T]> {
    const viableChildren = this.removeUnviableNodes(children);
    if (viableChildren.length === 0) {
      return [RouterStatusEnum.NO_VIABLE_OPTIONS, node];
    }

    const routerResponse = await this.routerInstructor.run(
      {
        options: viableChildren.map(child => child.description),
        content: this.context.content,
        systemMessage: (this.constructor as unknown as typeof AbstractRouter<T, D, C>).systemPrompt,
      },
      this.actionNode.id
    );

    if (routerResponse.bestOption !== null) {
      this.markUnviableNodes(children, routerResponse.unviableOptions);
      const selectedNode = viableChildren[routerResponse.bestOption];
      this.context.markedNodeIds.push(selectedNode.id);
      return [RouterStatusEnum.SEARCHING, selectedNode];
    }

    this.markUnviableNodes(children, children.map((_, index) => index));
    return [RouterStatusEnum.NO_VIABLE_OPTIONS, node];
  }

  private markUnviableNodes(children: T[], unviableOptions: number[]): void {
    this.context.markedNodeIds.push(...unviableOptions.map(index => children[index].id));
  }

  private removeUnviableNodes(children: T[]): T[] {
    return children.filter(child => !this.context.markedNodeIds.includes(child.id));
  }

  private async backtrack(node: T): Promise<[RouterStatusEnum, T]> {
    while (true) {
      const parentNode = await this.nodeDao.getParent(node.id);
      if (parentNode) {
        node = parentNode as T; // Type assertion needed here
        this.context.markedNodeIds.push(node.id);
        const children = await this.nodeDao.getChildren(node.id);
        const filteredChildren = this.removeUnviableNodes(children);
        if (filteredChildren.length > 0) {
          return [RouterStatusEnum.SEARCHING, node];
        }
      } else {
        return [RouterStatusEnum.FAILURE, node];
      }
    }
  }
}