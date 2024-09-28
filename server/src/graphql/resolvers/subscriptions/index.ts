import { PubSub } from 'graphql-subscriptions';
import { SubscriptionResolvers, Message } from '../../generated/graphql';
import { ResolverContext } from '../../createApolloGqlServer';
import assert from 'assert';
import { logger } from '../../../utils/logging/logger';

const pubsub = new PubSub();

export enum WebsocketTopic {
  NEW_MESSAGE = 'NEW_MESSAGE'
}

export const Subscription: SubscriptionResolvers = {
  messageSent: {
    subscribe: async (_, { chatId }, { req }: ResolverContext) => {
      assert(req.user, 'User not found')
      const asyncIterator = pubsub.asyncIterator(`${WebsocketTopic.NEW_MESSAGE}_${req.user.id}_${chatId}`);
      return {
        [Symbol.asyncIterator]() {
          return asyncIterator;
        },
      };
    },
    resolve: (payload: { messageSent: Message }): Message => {
      if (!payload.messageSent) {
        logger.error('Message not found in payload');
        throw new Error('Message not found');
      }
      return payload.messageSent;
    },
  },
};

export { pubsub };
