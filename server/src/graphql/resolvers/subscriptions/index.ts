import { PubSub } from 'graphql-subscriptions';
import { SubscriptionResolvers } from '../../generated/graphql';
import { ResolverContext } from '../../createApolloServer';
import assert from 'assert';

const pubsub = new PubSub();

export const Subscription: SubscriptionResolvers = {
  messageReceived: {
    subscribe: async (_, __, { req }: ResolverContext) => {
      assert(req.user, 'User not found');
      const asyncIterator = pubsub.asyncIterator(`MESSAGE_RECEIVED_${req.user.id}`);
      return {
        [Symbol.asyncIterator]() {
          return asyncIterator;
        },
      };
    },
    resolve: (payload: any) => {
      return payload;
    },
  },
};
