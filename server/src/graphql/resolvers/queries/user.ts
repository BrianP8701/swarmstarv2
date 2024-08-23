import assert from 'assert'
import { UserResolvers, UserTypeEnum } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloServer'

export const User: UserResolvers = {
  type: async (_first, _second, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    return UserTypeEnum.Admin
  }
}
