export type WebSocketPayload = {
  userId: string
  type: WebSocketMessageType
  body: WebSocketPayloadBody
}

export enum WebSocketMessageType {
  NEW_MESSAGE = 'NEW_MESSAGE',
}

export type WebSocketPayloadBody = NewMessagePayload

export type NewMessagePayload = {
  messageId: string
}
