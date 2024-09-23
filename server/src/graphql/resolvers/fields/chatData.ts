import { ChatDataResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { ChatDao } from '../../../dao/ChatDao'
import { formatDbChatMessageToGqlChatMessage } from '../../formatters/chatFormatters'

export const ChatData: ChatDataResolvers = {
  messages: async (parent) => {
    const chatDao = container.get(ChatDao)
    const chat = await chatDao.getWithMessages(parent.id)
    return chat.messages.map(formatDbChatMessageToGqlChatMessage)
  },
}
