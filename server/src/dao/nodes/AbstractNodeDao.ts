import { AbstractDao } from '../AbstractDao'

export abstract class AbstractNodeDao<TNode, TNodeCreateInput, TNodeUpdateInput, TNodeInclude> extends AbstractDao<
  TNode,
  TNodeCreateInput,
  TNodeUpdateInput,
  TNodeInclude
> {
  abstract getOutgoingNodes(nodeId: string): Promise<TNode[]>
  abstract getIncomingNodes(nodeId: string): Promise<TNode[]>
  abstract getAllConnectedNodes(nodeId: string): Promise<TNode[]>
}
