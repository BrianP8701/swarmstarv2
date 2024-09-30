import { ActionGraphDao } from '../../../../dao/graphs/ActionGraphDao'
import { container } from '../../../../utils/di/container'
import { formatActionNode } from '../../../formatters/nodes/actionFormatters'
import { ActionGraphResolvers } from '../../../generated/graphql'

export const ActionGraph: ActionGraphResolvers = {
  nodes: async parent => {
    const actionGraphDao = container.get(ActionGraphDao)
    const nodes = await actionGraphDao.getNodes(parent.id)
    return nodes.map(formatActionNode)
  },
  edges: async parent => {
    const actionGraphDao = container.get(ActionGraphDao)
    const edges = await actionGraphDao.getEdges(parent.id)
    return edges
  },
}
