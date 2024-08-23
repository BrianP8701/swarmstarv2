import { ResolverContext } from '../../createApolloServer'
import { QueryResolvers, UserTypeEnum } from '../../generated/graphql'

export const RootQuery: QueryResolvers = {
  user: async (_, __, { req }: ResolverContext) => {
    if (!req.user?.id) {
      return null
    }
    return { id: req.user?.id, type: UserTypeEnum.Admin }
  }
}
