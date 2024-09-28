import { RootQuery } from './queries';
import { ActionMetadataQuery } from './queries/actionMetadataQuery';
import { Swarm } from './fields/swarm';
import { User } from './fields/user';
import { RootMutation } from './mutations';
import { MemoryMutation } from './mutations/memoryMutation';
import { SwarmMutation } from './mutations/swarmMutation';
import { Memory } from './fields/memory';
import { SwarmData } from './fields/swarmData';
import { ChatMutation } from './mutations/chatMutation';
import { ChatData } from './fields/chatData';
import { Chat } from './fields/chat';
import { Subscription } from './subscriptions';

export const resolvers = {
  // Root
  RootQuery,
  RootMutation,
  Subscription,

  // Queries
  ActionMetadataQuery,

  // Field Resolvers
  Swarm,
  Memory,
  SwarmData,
  User,
  Chat,
  ChatData,

  // Mutations
  SwarmMutation,
  MemoryMutation,
  ChatMutation,
};
