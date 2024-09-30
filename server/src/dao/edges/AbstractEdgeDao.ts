import { AbstractDao } from '../AbstractDao'

export abstract class AbstractEdgeDao<TEdge, TEdgeCreateInput, TEdgeUpdateInput, TEdgeInclude> extends AbstractDao<
  TEdge,
  TEdgeCreateInput,
  TEdgeUpdateInput,
  TEdgeInclude
> {
  abstract getOutgoingEdges(nodeId: string): Promise<TEdge[]>
  abstract getIncomingEdges(nodeId: string): Promise<TEdge[]>
  abstract getAllConnectedEdges(nodeId: string): Promise<TEdge[]>
}
