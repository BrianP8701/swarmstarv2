import { AlertPayload } from "./payload/AlertPayload"
import { OperationPayload } from "./payload/OperationPayload"
import { WebSocketPayload } from "./payload/WebSocketPayload"

export enum PubSubTopic {
  AlertHandler = 'alert-handler',
  OperationHandler = 'operation-handler',
  WebSocketHandler = 'websocket-handler',
}

export type TopicPayload = {
  [PubSubTopic.AlertHandler]: AlertPayload
  [PubSubTopic.OperationHandler]: OperationPayload
  [PubSubTopic.WebSocketHandler]: WebSocketPayload
}
