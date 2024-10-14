import assert from 'assert'
import { PanelLayoutResolvers } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloGqlServer'
import { container } from '../../../utils/di/container'
import { PanelLayoutDao } from '../../../dao/PanelLayoutDao'
import { formatPrismaPanelNodesToGqlPanelNode } from '../../formatters/panelNodeFormatters'

export const PanelLayout: PanelLayoutResolvers = {
  isEditable: async (parent, _, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const panelLayoutDao = container.get(PanelLayoutDao)
    const panelLayout = await panelLayoutDao.get(parent.id)
    return panelLayout.isEditable
  },
  rootPanelNode: async (parent, _, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const panelLayoutDao = container.get(PanelLayoutDao)
    const panelNodes = await panelLayoutDao.getPanelNodes(parent.id)

    // Convert Prisma PanelNodes to GraphQL PanelNode tree
    const rootPanelNode = formatPrismaPanelNodesToGqlPanelNode(panelNodes)
    return rootPanelNode
  },
}
