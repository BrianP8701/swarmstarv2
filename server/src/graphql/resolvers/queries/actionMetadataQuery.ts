import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { ActionMetadataQueryResolvers } from '../../generated/graphql'
import { GlobalContextDao } from '../../../dao/nodes/GlobalContextDao'
import { ActionMetadataNodeDao } from '../../../dao/nodes/ActionMetadataDao'
import { formatActionMetadataNode } from '../../formatters/swarmFormatter'

export const ActionMetadataQuery: ActionMetadataQueryResolvers = {
  getActionMetadata: async (_, __, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const globalContextDao = await container.get(GlobalContextDao)
    const actionMetadataDao = await container.get(ActionMetadataNodeDao)
    const swarmId = await globalContextDao.getDefaultSwarmId()
    const actionMetadataNodes = await actionMetadataDao.getAll(swarmId)
    return actionMetadataNodes.map(formatActionMetadataNode)
  }
}
