import assert from 'assert'
import { ResolverContext } from '../../createApolloServer'
import { SwarmMutationResolvers } from '../../generated/graphql'
import { SwarmService } from '../../../services/SwarmService'

export const SwarmMutation: SwarmMutationResolvers = {
  createSwarm: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const swarmService = await container.get(SwarmService)
    const swarm = await swarmService.createSwarm(req.user.id, input)
    return swarm
  }
}
