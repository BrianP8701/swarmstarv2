import { Chat, Message } from "@prisma/client"
import { ChatData as GqlChatData, Message as GqlChatMessage } from "../generated/graphql"

export const formatDbChatToGqlChatData = (chat: Chat & { messages: Message[] }): GqlChatData => {
  return {
    id: chat.id,
    messages: chat.messages.map(formatDbChatMessageToGqlChatMessage),
  }
}

export const formatDbChatMessageToGqlChatMessage = (message: Message): GqlChatMessage => {
  return {
    id: message.id,
    content: message.content,
  }
}
