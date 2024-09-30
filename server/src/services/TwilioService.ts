import { Twilio } from 'twilio'
import { inject, injectable } from 'inversify'
import { SecretService } from './SecretService'
import { logger } from '../utils/logging/logger'

@injectable()
export class TwilioService {
  private twilio: Twilio

  constructor(@inject(SecretService) private secretService: SecretService) {
    this.twilio = new Twilio(
      this.secretService.getEnvVars().TWILIO_ACCOUNT_SID,
      this.secretService.getEnvVars().TWILIO_AUTH_TOKEN
    )
  }

  async sendSms(message: string): Promise<void> {
    try {
      await this.twilio.messages.create({
        body: message,
        from: this.secretService.getEnvVars().TWILIO_PHONE_NUMBER,
        to: this.secretService.getEnvVars().MY_PHONE_NUMBER,
      })
    } catch (error) {
      logger.error('Failed to send SMS notification', { error })
      throw error
    }
  }
}
