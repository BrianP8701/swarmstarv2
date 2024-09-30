import { injectable } from 'inversify'
import { PubSubTopic, TopicPayload } from './PubSubTopic'
import { PubSubMediator } from './PubSubMediator'
import { SecretService, Environment } from '../../services/SecretService'
import { PubSubHandler } from './PubSubHandler'
import { container } from '../../utils/di/container'
import { logger } from '../../utils/logging/logger'

@injectable()
export abstract class NonCloudFunctionHandler<T extends PubSubTopic> implements PubSubHandler<T> {
  protected secretService: SecretService
  protected pubSubMediator: PubSubMediator
  constructor() {
    this.secretService = container.get(SecretService)
    this.pubSubMediator = container.get(PubSubMediator)
  }

  public abstract getTopic(): T

  public async handle(payload: TopicPayload[T]): Promise<void> {
    const extractedPayload = this.extractPayload(payload)
    await this.handleEvent(extractedPayload)
  }

  protected extractPayload(payload: TopicPayload[T]): TopicPayload[T] {
    logger.info(`Received payload: ${JSON.stringify(payload)}`)
    return payload
  }

  protected abstract handleEvent(payload: TopicPayload[T]): Promise<void>

  public registerLocalHandler(): void {
    if (this.secretService.getEnvVars().MODE === Environment.LOCAL) {
      this.pubSubMediator.registerLocalHandler(this.getTopic(), this.handle.bind(this))
    }
  }
}
