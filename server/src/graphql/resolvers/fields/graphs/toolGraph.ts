import { ToolGraphResolvers } from "../../../generated/graphql";
import { container } from "../../../../utils/di/container";
import { ToolGraphDao } from "../../../../dao/graphs/ToolGraphDao";

export const ToolGraph: ToolGraphResolvers = {
  nodes: async (parent) => {
    const toolGraphDao = container.get(ToolGraphDao)
    const nodes = await toolGraphDao.getNodes(parent.id)
    return nodes
  },
  edges: async (parent) => {
    const toolGraphDao = container.get(ToolGraphDao)
    const edges = await toolGraphDao.getEdges(parent.id)
    return edges
  },
}
