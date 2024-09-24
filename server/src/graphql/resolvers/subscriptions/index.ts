import { PubSub } from 'graphql-subscriptions';
import { SubscriptionResolvers } from '../../generated/graphql';

const pubsub = new PubSub();

export const Subscription: SubscriptionResolvers = {
  messageReceived: {
    subscribe: (_parent, { userId }) => pubsub.asyncIterator(`MESSAGE_RECEIVED_${userId}`),
  },
};
