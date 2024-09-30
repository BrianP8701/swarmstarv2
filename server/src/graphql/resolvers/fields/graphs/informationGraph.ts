import { InformationGraphResolvers } from '../../../generated/graphql'
import { container } from '../../../../utils/di/container'
import { InformationGraphDao } from '../../../../dao/graphs/InformationGraphDao'

export const InformationGraph: InformationGraphResolvers = {
  title: async parent => {
    const informationGraphDao = container.get(InformationGraphDao)
    const informationGraph = await informationGraphDao.get(parent.id)
    return informationGraph.title
  },
  nodes: async parent => {
    const informationGraphDao = container.get(InformationGraphDao)
    const nodes = await informationGraphDao.getNodes(parent.id)
    return nodes
  },
  edges: async parent => {
    const informationGraphDao = container.get(InformationGraphDao)
    const edges = await informationGraphDao.getEdges(parent.id)
    return edges
  },
}
