import { injectable, inject } from 'inversify'
import { PubSubTopic, TopicPayload } from './PubSubTopic'
import { PublisherService } from './PublisherService'
import { LocalPubSubEmulator } from './LocalPubSubEmulator'
import { Environment, SecretService } from '../../services/SecretService'
import { Attributes } from '@google-cloud/pubsub'
import { logger } from '../../utils/logging/logger'

@injectable()
export class PubSubMediator {
  constructor(
    @inject(PublisherService) private publisherService: PublisherService,
    @inject(LocalPubSubEmulator) private localPubSubEmulator: LocalPubSubEmulator,
    @inject(SecretService) private secretService: SecretService
  ) {}

  public async publishEvent<T extends PubSubTopic>(
    topicKey: T,
    payload: TopicPayload[T],
    attributes?: Attributes
  ): Promise<string | void> {
    if (this.secretService.getEnvVars().MODE === Environment.LOCAL) {
      logger.info('Publishing event locally', { topicKey, payload })
      await this.localPubSubEmulator.publishEvent(topicKey, payload)
      return
    } else {
      return this.publisherService.publishEvent(topicKey, payload, attributes)
    }
  }

  public registerLocalHandler<T extends PubSubTopic>(
    topic: T,
    handler: (payload: TopicPayload[T]) => Promise<void>
  ): void {
    this.localPubSubEmulator.registerHandler(topic, handler)
  }
}
