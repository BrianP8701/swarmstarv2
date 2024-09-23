import assert from 'assert'
import { ResolverContext } from '../../createApolloServer'
import { ChatMutationResolvers } from '../../generated/graphql'
import { ChatDao } from '../../../dao/ChatDao'
import { formatDbChatWithMessagesToGqlChat } from '../../formatters/chatFormatters'

export const ChatMutation: ChatMutationResolvers = {
  sendMessage: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const chatDao = await container.get(ChatDao)
    const chat = await chatDao.sendMessage(input.chatId, input.content)
    return formatDbChatWithMessagesToGqlChat(chat)
  }
}
