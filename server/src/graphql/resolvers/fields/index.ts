import { ResolverContext } from '../../createApolloServer'
import { RootQueryResolvers, UserTypeEnum } from '../../generated/graphql'

export const RootQuery: RootQueryResolvers = {
  user: async (_, __, { req }: ResolverContext) => {
    console.log('req.user in user', req.user)
    if (!req.user?.id) {
      return null
    }
    return { id: req.user?.id, type: UserTypeEnum.Admin }
  },
  swarm: async (_, __) => {
    return {}
  },
  actionMetadata: async (_, __) => {
    return {}
  },
}
