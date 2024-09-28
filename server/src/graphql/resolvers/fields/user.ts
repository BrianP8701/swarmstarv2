import assert from 'assert'
import { UserResolvers } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloGqlServer'
import { UserDao } from '../../../dao/UserDao'
import { container } from '../../../utils/di/container'
import { formatUserTypeEnum } from '../../formatters/userFormatters'
import { formatMemory } from '../../formatters/swarmFormatter'

export const User: UserResolvers = {
  type: async (_, __, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const user = await userDao.get(req.user.id)
    return formatUserTypeEnum(user.type)
  },
  swarms: async (_, __, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const swarms = await userDao.getSwarms(req.user.id)
    return swarms
  },
  memories: async (_, __, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const memories = await userDao.getMemories(req.user.id)
    return memories.map(formatMemory)
  },
}
