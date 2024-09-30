import { AbstractDao } from '../AbstractDao'

export abstract class AbstractGraphDao<
  TGraph,
  TNode,
  TEdge,
  TGraphCreateInput,
  TGraphUpdateInput,
  TGraphInclude,
> extends AbstractDao<TGraph, TGraphCreateInput, TGraphUpdateInput, TGraphInclude> {
  abstract getGraph(id: string): Promise<{ nodes: TNode[]; edges: TEdge[] }>
  abstract getNodes(id: string): Promise<TNode[]>
  abstract getEdges(id: string): Promise<TEdge[]>
}
