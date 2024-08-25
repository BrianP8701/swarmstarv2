import { ResolverContext } from '../../createApolloServer'
import { RootQueryResolvers, UserTypeEnum } from '../../generated/graphql'

export const RootQuery: RootQueryResolvers = {
  user: async (_, __, { req }: ResolverContext) => {
    if (!req.user?.id) {
      return null
    }
    return { id: req.user?.id, type: UserTypeEnum.Admin }
  }
}
