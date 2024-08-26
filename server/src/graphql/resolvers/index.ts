import { RootQuery } from './fields'
import { ActionMetadataQuery } from './fields/actionMetadataQuery'
import { User } from './fields/user'
import { RootMutation } from './mutations'
import { MemoryMutation } from './mutations/memoryMutation'
import { SwarmMutation } from './mutations/swarmMutation'

export const resolvers = {
  RootQuery,
  RootMutation,
  User,
  ActionMetadataQuery,
  SwarmMutation,
  MemoryMutation,
}
