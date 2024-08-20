import assert from 'assert'
import { UserResolvers } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloServer'

export const User: UserResolvers = {
  id: async (_first, _second, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    return _first.id
  }
}
