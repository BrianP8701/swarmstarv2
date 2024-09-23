import { container } from '../../../utils/di/container'
import { ChatResolvers } from '../../generated/graphql'
import { ChatDao } from '../../../dao/ChatDao'

export const ChatData: ChatResolvers = {
  title: async (parent) => {
    const chatDao = container.get(ChatDao)
    const chat = await chatDao.get(parent.id)
    return chat.title
  },
  data: async (parent) => {
    return { id: parent.id }
  }
}
