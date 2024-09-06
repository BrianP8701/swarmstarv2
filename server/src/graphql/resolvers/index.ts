import { RootQuery } from './queries'
import { ActionMetadataQuery } from './queries/actionMetadataQuery'
import { Swarm } from './fields/swarm'
import { User } from './fields/user'
import { RootMutation } from './mutations'
import { MemoryMutation } from './mutations/memoryMutation'
import { SwarmMutation } from './mutations/swarmMutation'
import { Memory } from './fields/memory'
import { SwarmData } from './fields/swarmData'

export const resolvers = {
  // Root
  RootQuery,
  RootMutation,

  // Queries
  ActionMetadataQuery,

  // Field Resolvers
  Swarm,
  Memory,
  SwarmData,
  User,

  // Mutations
  SwarmMutation,
  MemoryMutation,
}
