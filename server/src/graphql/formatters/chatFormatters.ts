import { Chat, ChatStatusEnum, Message, MessageRoleEnum } from '@prisma/client'
import {
  Chat as GqlChat,
  ChatStatusEnum as GqlChatStatusEnum,
  Message as GqlChatMessage,
  MessageRoleEnum as GqlMessageRoleEnum,
} from '../generated/graphql'

export const formatDbChatToGqlChat = (chat: Chat & { messages?: Message[] }): GqlChat => {
  return {
    id: chat.id,
    title: chat.title,
    status: convertDbChatStatusToGqlChatStatus(chat.status),
    messages: chat.messages ? chat.messages.map(formatDbChatMessageToGqlChatMessage) : undefined,
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
  }
}

export const convertDbChatStatusToGqlChatStatus = (status: ChatStatusEnum): GqlChatStatusEnum => {
  switch (status) {
    case ChatStatusEnum.ACTIVE:
      return GqlChatStatusEnum.Active
    case ChatStatusEnum.COMPLETED:
      return GqlChatStatusEnum.Completed
  }
}
