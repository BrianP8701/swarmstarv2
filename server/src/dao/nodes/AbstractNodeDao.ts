import { AbstractDao } from "../AbstractDao"

export abstract class AbstractNodeDao<
  TNode,
  TEdge,
  TNodeCreateInput,
  TNodeUpdateInput,
  TEdgeCreateInput,
  TEdgeUpdateInput,
  TNodeInclude,
  TEdgeInclude
> extends AbstractDao<TNode, TNodeCreateInput, TNodeUpdateInput, TNodeInclude> {
  abstract getOutgoingNodes(nodeId: string): Promise<TNode[]>;
  abstract getIncomingNodes(nodeId: string): Promise<TNode[]>;
  abstract getOutgoingEdges(nodeId: string): Promise<TEdge[]>;
  abstract getIncomingEdges(nodeId: string): Promise<TEdge[]>;
  abstract getAllConnectedNodes(nodeId: string): Promise<TNode[]>;
  abstract getAllConnectedEdges(nodeId: string): Promise<TEdge[]>;
  abstract getEdge(id: string): Promise<TEdge>;
  abstract edgeExists(id: string): Promise<boolean>;
  abstract createEdge(createInput: TEdgeCreateInput, includeClauses?: TEdgeInclude): Promise<TEdge>;
  abstract updateEdge(id: string, updateInput: TEdgeUpdateInput): Promise<TEdge>;
}
