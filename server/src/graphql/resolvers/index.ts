import { RootMutation } from './mutations';
import { Subscription } from './subscriptions';

import { InformationGraph } from './fields/graphs/informationGraph';
import { ToolGraph } from './fields/graphs/toolGraph';
import { AgentGraph } from './fields/graphs/agentGraph';
import { ActionGraph } from './fields/graphs/actionGraph';

import { Swarm } from './fields/swarm';
import { User } from './fields/user';
import { SwarmMutation } from './mutations/swarmMutation';
import { ChatMutation } from './mutations/chatMutation';
import { Chat } from './fields/chat';
import { InformationGraphMutation } from './mutations/informationGraphMutation';
import { RootQuery } from './queries';

export const resolvers = {
  // Root
  RootQuery,
  RootMutation,
  Subscription,

  // Field Resolvers
  Swarm,
  User,
  Chat,
  InformationGraph,
  ToolGraph,
  AgentGraph,
  ActionGraph,

  // Mutations
  SwarmMutation,
  ChatMutation,
  InformationGraphMutation
};
