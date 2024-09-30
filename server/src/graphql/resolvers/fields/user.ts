import assert from 'assert'
import { UserResolvers } from '../../generated/graphql'
import { ResolverContext } from '../../createApolloGqlServer'
import { UserDao } from '../../../dao/UserDao'
import { container } from '../../../utils/di/container'

export const User: UserResolvers = {
  swarms: async (_, __, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const swarms = await userDao.getSwarms(req.user.id)
    return swarms
  },
  informationGraphs: async (_, __, { req }: ResolverContext) => {
    assert(req.user?.id, 'User is not authenticated')
    const userDao = container.get(UserDao)
    const user = await userDao.getWithData(req.user.id)
    return user.informationGraphs.map(informationGraph => ({
      id: informationGraph.id,
    }))
  },
}
