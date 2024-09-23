import { Chat, Message, MessageRoleEnum } from "@prisma/client"
import { Chat as GqlChat, ChatData as GqlChatData, Message as GqlChatMessage, MessageRoleEnum as GqlMessageRoleEnum } from "../generated/graphql"

export const formatDbChatWithMessagesToGqlChat = (chat: Chat & { messages: Message[] }): GqlChat => {
  return {
    id: chat.id,
    title: chat.title,
    data: {
      id: chat.id,
      messages: chat.messages.map(formatDbChatMessageToGqlChatMessage),
    },
  }
}

export const formatDbChatToGqlChatData = (chat: Chat & { messages: Message[] }): GqlChatData => {
  return {
    id: chat.id,
    messages: chat.messages.map(formatDbChatMessageToGqlChatMessage),
  }
}

export const formatDbChatMessageToGqlChatMessage = (message: Message): GqlChatMessage => {
  return {
    id: message.id,
    role: convertDbMessageRoleToGqlMessageRole(message.role),
    content: message.content,
  }
}

export const convertDbMessageRoleToGqlMessageRole = (role: MessageRoleEnum): GqlMessageRoleEnum => {
  switch (role) {
    case MessageRoleEnum.USER:
      return GqlMessageRoleEnum.User
    case MessageRoleEnum.ASSISTANT:
      return GqlMessageRoleEnum.Assistant
    case MessageRoleEnum.SYSTEM:
      return GqlMessageRoleEnum.System
    case MessageRoleEnum.SWARMSTAR:
      return GqlMessageRoleEnum.Swarmstar
  }
}