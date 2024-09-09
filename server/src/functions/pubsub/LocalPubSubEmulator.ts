import { injectable } from 'inversify'
import { PubSubTopic, TopicPayload } from './PubSubTopic'
import { logger } from '../../utils/logging/logger'

type HandlerFunction<T extends PubSubTopic> = (payload: TopicPayload[T]) => Promise<void>

@injectable()
export class LocalPubSubEmulator {
  private handlers: Map<PubSubTopic, HandlerFunction<PubSubTopic>> = new Map()

  public registerHandler<T extends PubSubTopic>(topic: T, handler: HandlerFunction<T>): void {
    this.handlers.set(topic, handler as HandlerFunction<PubSubTopic>)
  }

  public async publishEvent<T extends PubSubTopic>(topic: T, payload: TopicPayload[T]): Promise<void> {
    const handler = this.handlers.get(topic)
    if (handler) {
      await handler(payload)
    } else {
      logger.warn(`No local handler registered for topic: ${topic}`)
    }
  }
}
