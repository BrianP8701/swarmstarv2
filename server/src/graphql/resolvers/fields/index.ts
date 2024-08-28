import assert from 'assert'
import { SwarmDao } from '../../../dao/SwarmDao'
import { UserDao } from '../../../dao/UserDao'
import { container } from '../../../utils/di/container'
import { ResolverContext } from '../../createApolloServer'
import { formatUserTypeEnum } from '../../formatters/userFormatters'
import { RootQueryResolvers } from '../../generated/graphql'

export const RootQuery: RootQueryResolvers = {
  actionMetadata: async (_, __) => {
    return {}
  },
  fetchSwarm: async (_, { id }) => {
    const swarmDao = container.get(SwarmDao)
    return swarmDao.getBasic(id)
  },
  fetchUser: async (_, __, { req, container }: ResolverContext) => {
    const userDao = container.get(UserDao)
    assert(req.user, 'User is not logged in')
    const user = await userDao.getWithData(req.user.id)
    return {
      id: user.id,
      type: formatUserTypeEnum(user.type),
      swarms: user.swarms,
      memories: user.memories,
    }
  },
}
