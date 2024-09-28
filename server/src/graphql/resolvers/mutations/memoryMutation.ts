import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { MemoryMutationResolvers } from '../../generated/graphql'
import { MemoryDao } from '../../../dao/nodes/MemoryDao'

export const MemoryMutation: MemoryMutationResolvers = {
  createMemory: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const memoryDao = await container.get(MemoryDao)
    const memory = await memoryDao.create(req.user.id, input.title)
    return memory
  }
}
