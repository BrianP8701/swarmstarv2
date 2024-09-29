import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { RootQueryResolvers } from '../../generated/graphql'
import { GlobalContextDao } from '../../../dao/GlobalContextDao'

export const RootQuery: RootQueryResolvers = {
  user: async (_parent, _args, { req }: ResolverContext) => {
    assert(req.user, 'User is not logged in')
    return { id: req.user.id }
  },
  actionGraph: async (_parent, _args, { container }: ResolverContext) => {
    const globalContextDao = container.get(GlobalContextDao)
    const globalContext = await globalContextDao.get()
    return { id: globalContext.actionGraphId }
  },
  toolGraph: async (_parent, _args, { container }: ResolverContext) => {
    const globalContextDao = container.get(GlobalContextDao)
    const globalContext = await globalContextDao.get()
    return { id: globalContext.toolGraphId }
  },
  swarm: async (_parent, { id }: { id: string }) => {
    return { id }
  },
  chat: async (_parent, { id }: { id: string }) => {
    return { id }
  }
}
