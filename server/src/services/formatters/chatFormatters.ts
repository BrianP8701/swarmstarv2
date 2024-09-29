import { Message, MessageRoleEnum } from "@prisma/client";
import { InstructorMessage, InstructorMessageRoleEnum } from "../InstructorService";

export const formatDbChatToInstructorChat = (messages: Message[]): InstructorMessage[] => {
  return messages.map(formatDbMessageToInstructorMessage)
}

export const formatDbMessageToInstructorMessage = (message: Message): InstructorMessage => {
  return {
    role: formatDbMessageRoleToInstructorMessageRole(message.role),
    content: message.content,
  }
}

export const formatDbMessageRoleToInstructorMessageRole = (role: MessageRoleEnum): InstructorMessageRoleEnum => {
  switch (role) {
    case MessageRoleEnum.USER:
      return InstructorMessageRoleEnum.USER
    case MessageRoleEnum.ASSISTANT:
      return InstructorMessageRoleEnum.ASSISTANT
    case MessageRoleEnum.SYSTEM:
      return InstructorMessageRoleEnum.SYSTEM
    default:
      throw new Error(`Unsupported message role: ${role}`)
  }
}
