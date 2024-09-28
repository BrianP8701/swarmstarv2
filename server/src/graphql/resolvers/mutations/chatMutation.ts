import assert from 'assert';
import { ResolverContext } from '../../createApolloGqlServer';
import { ChatMutationResolvers } from '../../generated/graphql';
import { formatDbChatWithMessagesToGqlChat } from '../../formatters/chatFormatters';
import { ChatService } from '../../../services/ChatService';
import { MessageRoleEnum } from '@prisma/client';

export const ChatMutation: ChatMutationResolvers = {
  sendMessage: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found');
    const chatService = container.get(ChatService);
    const chat = await chatService.sendMessage(input.chatId, input.content, MessageRoleEnum.USER);
    const formattedChat = formatDbChatWithMessagesToGqlChat(chat);
    return formattedChat;
  }
};
