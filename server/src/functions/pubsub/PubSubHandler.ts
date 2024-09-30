import { PubSubTopic, TopicPayload } from './PubSubTopic'

export interface PubSubHandler<T extends PubSubTopic> {
  getTopic(): T
  handle(payload: TopicPayload[T]): Promise<void>
  registerLocalHandler(): void
}
