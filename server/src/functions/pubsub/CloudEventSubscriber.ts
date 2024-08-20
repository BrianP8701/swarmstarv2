import functions, { CloudEventFunction } from '@google-cloud/functions-framework'
import assert from 'assert'
import { injectable } from 'inversify'
import { TopicPayload } from '../PubSubTopic'

import { Attributes } from '@google-cloud/pubsub'
import { logger } from '../../utils/logging/logger'
import { TraceContext } from '../../utils/logging/TraceContext'
import { Buffer } from 'buffer'

// TODO: Replace with official GCP managed type
export interface CloudEventPayload {
  message: {
    data: string // base64 encoded buffer of JSON stringified payload
    attributes?: Attributes
  }
}

@injectable()
export abstract class CloudEventSubscriberFunction<PayloadType extends TopicPayload[keyof TopicPayload]> {
  protected async handleEvent(cloudEvent: functions.CloudEvent<CloudEventPayload>): Promise<void> {
    const context = TraceContext.fromCloudEvent(cloudEvent)
    await TraceContext.runAsync(context, async () => {
      const payload = this.extractPayload(cloudEvent)
      await this.handle(payload)
    })
  }

  protected extractPayload = (cloudEvent: functions.CloudEvent<CloudEventPayload>): PayloadType => {
    assert(cloudEvent.data, 'cloudEvent.data must be defined')

    const base64Data = cloudEvent.data.message.data
    const jsonString = Buffer.from(base64Data, 'base64').toString()
    const payload = JSON.parse(jsonString) as PayloadType // dataObject is the object you sent
    logger.info(`Received payload: ${JSON.stringify(payload)}`)
    return payload
  }

  protected abstract handle(payload: PayloadType): Promise<void>
  protected static eventHandler: CloudEventFunction<CloudEventPayload>
}
