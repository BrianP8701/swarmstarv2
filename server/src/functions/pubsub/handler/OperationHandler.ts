import functions from '@google-cloud/functions-framework'

import { injectable } from 'inversify'
import { container } from '../../../utils/di/container'
import { CloudEventPayload, CloudEventSubscriberFunction } from '../CloudEventSubscriber'
import { logger } from '../../../utils/logging/logger'
import { PubSubTopic } from '../PubSubTopic'
import { OperationPayload, OperationType } from '../payload/OperationPayload'

@injectable()
export class OperationHandler extends CloudEventSubscriberFunction<PubSubTopic.OperationHandler> {
  constructor() {
    super()
  }

  protected getTopic(): PubSubTopic.OperationHandler {
    return PubSubTopic.OperationHandler
  }

  public handle = async (_payload: OperationPayload) => {
    switch (_payload.operationType) {
      case OperationType.FunctionCall: {
        break
      }
      case OperationType.Termination: {
        break
      }
      case OperationType.Blocking: {
        break
      }
      default: {
        logger.error('Operation Type Not handled by OperationHandler', { cause: _payload.operationType })
        break
      }
    }
  }

  static eventHandler = async (cloudEvent: functions.CloudEvent<CloudEventPayload>) => {
    const instance = container.get(OperationHandler)
    await instance.handleEvent(cloudEvent)
  }
}
