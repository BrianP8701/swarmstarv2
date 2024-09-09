import { AlertPayload } from "./payload/AlertPayload"
import { OperationPayload } from "./payload/OperationPayload"

export enum PubSubTopic {
  AlertHandler = 'alert-handler',
  OperationHandler = 'operation-handler',
}

export type TopicPayload = {
  [PubSubTopic.AlertHandler]: AlertPayload
  [PubSubTopic.OperationHandler]: OperationPayload
}
