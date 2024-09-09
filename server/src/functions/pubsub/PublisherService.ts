import { Attributes, PubSub, Topic } from '@google-cloud/pubsub'
import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher'
import assert from 'assert'
import { inject, injectable } from 'inversify'
import { TraceContext } from '../../utils/logging/TraceContext'
import { logger } from '../../utils/logging/logger'
import { TopicPayload } from './PubSubTopic'

@injectable()
export class PublisherService {
  private topicMap = new Map<string, Topic>()

  constructor(@inject(PubSub) private pubsub: PubSub) {}

  public async setupTopics() {
    if (this.topicMap.size !== 0) {
      return
    }
    logger.info('Topics are not initialized. Initializing...')

    const [topics] = await this.pubsub.getTopics()
    topics.forEach(topic => {
      const pububTopicName = topic.name.split('/').pop()
      assert(pububTopicName, 'pububTopicName must be defined')
      this.topicMap.set(pububTopicName, topic)
    })
  }

  public async publishEvent<TopicKey extends keyof TopicPayload>(
    topicKey: TopicKey,
    payload: TopicPayload[TopicKey],
    attributes?: Attributes
  ): Promise<string> {
    logger.info('Publishing Pubsub Event', { topicKey, payload, attributes })
    await this.setupTopics()
    const topic = this.topicMap.get(topicKey)
    assert(topic, `Pubsub topic is not found for ${topicKey}`)

    const attr: Attributes = {
      ...attributes,
      ...TraceContext.toMessageAttributes(),
    }
    const pubsubMessage: PubsubMessage = {
      data: Buffer.from(JSON.stringify(payload)),
      attributes: attr,
    }

    try {
      const messageId = await topic.publishMessage(pubsubMessage)
      logger.info(`Message ${messageId} published. With payload ${JSON.stringify(payload)})`)
      return messageId
    } catch (error) {
      logger.error(`Error publishing message ${JSON.stringify(pubsubMessage)} to topic ${topic.name}`)
      throw error
    }
  }
}
