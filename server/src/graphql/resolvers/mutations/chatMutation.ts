import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { ChatMutationResolvers } from '../../generated/graphql'
import { ChatService } from '../../../services/ChatService'
import { MessageRoleEnum } from '@prisma/client'
import { formatDbChatToGqlChat } from '../../formatters/chatFormatters'

export const ChatMutation: ChatMutationResolvers = {
  sendMessage: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const chatService = container.get(ChatService)
    const chat = await chatService.sendMessage(input.chatId, input.content, MessageRoleEnum.USER)
    return formatDbChatToGqlChat(chat)
  },
}
