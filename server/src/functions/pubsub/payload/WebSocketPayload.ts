export type WebSocketPayload = {
  userId: string
  type: WebSocketMessageType
  body: WebSocketPayloadBody
}

export enum WebSocketMessageType {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
}

export type WebSocketPayloadBody = ChatMessagePayload

export type ChatMessagePayload = {
  chatId: string
  message: string
}
