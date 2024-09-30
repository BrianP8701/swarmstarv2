import functions, { CloudEventFunction } from '@google-cloud/functions-framework'
import assert from 'assert'
import { injectable } from 'inversify'
import { PubSubTopic, TopicPayload } from './PubSubTopic'
import { Attributes } from '@google-cloud/pubsub'
import { logger } from '../../utils/logging/logger'
import { TraceContext } from '../../utils/logging/TraceContext'
import { PubSubMediator } from './PubSubMediator'
import { SecretService, Environment } from '../../services/SecretService'
import { container } from '../../utils/di/container'
import { PubSubHandler } from './PubSubHandler'

// TODO: Replace with official GCP managed type
export interface CloudEventPayload {
  message: {
    data: string // base64 encoded buffer of JSON stringified payload
    attributes?: Attributes
  }
}

@injectable()
export abstract class CloudEventSubscriberFunction<T extends PubSubTopic> implements PubSubHandler<T> {
  protected secretService: SecretService
  protected pubSubMediator: PubSubMediator
  constructor() {
    this.secretService = container.get(SecretService)
    this.pubSubMediator = container.get(PubSubMediator)
  }

  protected async handleEvent(cloudEvent: functions.CloudEvent<CloudEventPayload>): Promise<void> {
    const context = TraceContext.fromCloudEvent(cloudEvent)
    await TraceContext.runAsync(context, async () => {
      const payload = this.extractPayload(cloudEvent)
      await this.handle(payload)
    })
  }

  protected extractPayload = (cloudEvent: functions.CloudEvent<CloudEventPayload>): TopicPayload[T] => {
    assert(cloudEvent.data, 'cloudEvent.data must be defined')

    const base64Data = cloudEvent.data.message.data
    const jsonString = Buffer.from(base64Data, 'base64').toString()
    const payload = JSON.parse(jsonString) as TopicPayload[T] // dataObject is the object you sent
    logger.info(`Received payload: ${JSON.stringify(payload)}`)
    return payload
  }

  public abstract handle(payload: TopicPayload[T]): Promise<void>
  protected static eventHandler: CloudEventFunction<CloudEventPayload>

  public abstract getTopic(): T

  public registerLocalHandler(): void {
    if (this.secretService.getEnvVars().MODE === Environment.LOCAL) {
      this.pubSubMediator.registerLocalHandler(this.getTopic(), this.handle.bind(this))
    }
  }
}
