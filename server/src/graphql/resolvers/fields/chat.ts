import { container } from '../../../utils/di/container'
import { ChatResolvers } from '../../generated/graphql'
import { ChatDao } from '../../../dao/ChatDao'
import { 
  convertDbChatStatusToGqlChatStatus, 
  formatDbChatMessageToGqlChatMessage 
} from '../../formatters/chatFormatters'

export const Chat: ChatResolvers = {
  title: async (parent) => {
    const chatDao = container.get(ChatDao)
    const chat = await chatDao.get(parent.id)
    return chat.title
  },
  status: async (parent) => {
    const chatDao = container.get(ChatDao)
    const chat = await chatDao.get(parent.id)
    return convertDbChatStatusToGqlChatStatus(chat.status)
  },
  messages: async (parent) => {
    const chatDao = container.get(ChatDao)
    const chat = await chatDao.getWithMessages(parent.id)
    return chat.messages.map(formatDbChatMessageToGqlChatMessage)
  },
}
