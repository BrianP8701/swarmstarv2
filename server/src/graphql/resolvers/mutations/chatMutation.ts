import assert from 'assert';
import { ResolverContext } from '../../createApolloServer';
import { ChatMutationResolvers } from '../../generated/graphql';
import { formatDbChatWithMessagesToGqlChat } from '../../formatters/chatFormatters';
import { ChatService } from '../../../services/ChatService';
import { MessageRoleEnum } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const ChatMutation: ChatMutationResolvers = {
  sendMessage: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found');
    const chatService = container.get(ChatService);
    const chat = await chatService.sendMessage(input.chatId, input.content, MessageRoleEnum.USER);
    const formattedChat = formatDbChatWithMessagesToGqlChat(chat);
    await pubsub.publish(`MESSAGE_RECEIVED_${req.user.id}`, { messageReceived: formattedChat });
    return formattedChat;
  }
};
