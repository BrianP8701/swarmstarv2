import { AlertHandlerPayload } from "./pubsub/payload/AlertPayload"

export enum PubSubTopic {
  AlertHandler = 'alert-handler',
}

export type TopicPayload = {
  [PubSubTopic.AlertHandler]: AlertHandlerPayload
}
