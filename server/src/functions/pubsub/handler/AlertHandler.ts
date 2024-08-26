import functions from '@google-cloud/functions-framework'

import { inject, injectable } from 'inversify'
import { container } from '../../../utils/di/container'
import { CloudEventPayload, CloudEventSubscriberFunction } from '../CloudEventSubscriber'
import { AlertHandlerPayload } from '../payload/AlertPayload'
import { logger } from '../../../utils/logging/logger'
import { AlertType } from '../payload/AlertPayload'
import assert from 'assert'
import { TwilioService } from '../../../services/external/TwilioService'

@injectable()
export class AlertHandler extends CloudEventSubscriberFunction<AlertHandlerPayload> {
  constructor(
    @inject(TwilioService) private twilioService: TwilioService
  ) {
    super()
  }

  public handle = async (_payload: AlertHandlerPayload) => {
    switch (_payload.eventType) {
      case AlertType.NewUser: {
        assert(_payload.body, 'Alert Body is required')
        assert(_payload.body.type === AlertType.NewUser, 'Alert Body type is different from NewUser')
        const { userId } = _payload.body
        await this.twilioService.sendSms(`New user: ${userId}`)
        break
      }
      default: {
        logger.error('Event Type Not handled by EmailHandler', { cause: _payload.eventType })
        break
      }
    }
  }

  static eventHandler = async (cloudEvent: functions.CloudEvent<CloudEventPayload>) => {
    const instance = container.get(AlertHandler)
    await instance.handleEvent(cloudEvent)
  }
}