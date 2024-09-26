import assert from 'assert'
import { UserDao } from '../../../dao/UserDao'
import { ResolverContext } from '../../createApolloServer'
import { formatUserTypeEnum } from '../../formatters/userFormatters'
import { RootQueryResolvers } from '../../generated/graphql'

export const RootQuery: RootQueryResolvers = {
  actionMetadata: async () => {
    return {}
  },
  fetchSwarm: async (_parent, { swarmId }) => {
    return { id: swarmId }
  },
  fetchMemory: async (_parent, { memoryId }) => {
    return { id: memoryId }
  },
  fetchChat: async (_parent, { chatId }) => {
    return { id: chatId }
  },
  fetchUser: async (_parent, _args, { req, container }: ResolverContext) => {
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
