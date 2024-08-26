import assert from 'assert'
import { UserResolvers } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloServer'
import { UserDao } from '../../../dao/UserDao'
import { container } from '../../../utils/di/container'
import { formatUserTypeEnum } from '../../formatters/userFormatters'
import { formatMemory, formatSwarm } from '../../formatters/swarmFormatter'

export const User: UserResolvers = {
  type: async (_first, _second, { req }: ResolverContext) => {
    console.log('req.user in type', req.user)
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const user = await userDao.get(req.user.id)
    return formatUserTypeEnum(user.type)
  },
  swarms: async (_first, _second, { req }: ResolverContext) => {
    console.log('req.user in swarms', req.user)
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const swarms = await userDao.getSwarms(req.user.id)
    return swarms.map(formatSwarm)
  },
  memories: async (_first, _second, { req }: ResolverContext) => {
    console.log('req.user in memories', req.user)
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const memories = await userDao.getMemories(req.user.id)
    return memories.map(formatMemory)
  },
}
