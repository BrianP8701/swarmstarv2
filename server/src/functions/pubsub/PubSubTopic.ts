import { AlertPayload } from "./payload/AlertPayload"
import { OperationPayload } from "./payload/OperationPayload"
import { UserMessagePayload } from "./payload/UserMessagePayload"
import { WebSocketPayload } from "./payload/WebSocketPayload"

export enum PubSubTopic {
  AlertHandler = 'alert-handler',
  OperationHandler = 'operation-handler',
  WebSocketHandler = 'websocket-handler',
  UserMessageHandler = 'user-message-handler',
}

export type TopicPayload = {
  [PubSubTopic.AlertHandler]: AlertPayload
  [PubSubTopic.OperationHandler]: OperationPayload
  [PubSubTopic.WebSocketHandler]: WebSocketPayload
  [PubSubTopic.UserMessageHandler]: UserMessagePayload
}
