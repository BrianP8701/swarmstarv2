import { RootQuery } from './queries'
import { ActionMetadataQuery } from './queries/actionMetadataQuery'
import { Swarm } from './fields/swarm'
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
  Swarm,
}
