import { AgentGraphResolvers } from '../../../generated/graphql'
import { container } from '../../../../utils/di/container'
import { AgentGraphDao } from '../../../../dao/graphs/AgentGraphDao'
import { formatAgentEdgeToGqlAgentEdge } from '../../../formatters/nodes/agentFormatters'

export const AgentGraph: AgentGraphResolvers = {
  nodes: async parent => {
    const agentGraphDao = container.get(AgentGraphDao)
    const nodes = await agentGraphDao.getNodes(parent.id)
    return nodes
  },
  edges: async parent => {
    const agentGraphDao = container.get(AgentGraphDao)
    const edges = await agentGraphDao.getEdges(parent.id)
    return edges.map(edge => formatAgentEdgeToGqlAgentEdge(edge))
  },
}
