import { Twilio } from 'twilio';
import { injectable } from 'inversify';
import { logger } from '../../utils/logging/logger';
import assert from 'assert';

@injectable()
export class TwilioService {
  private twilio: Twilio;

  constructor() {
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSms(message: string): Promise<void> {
    assert(process.env.TWILIO_PHONE_NUMBER, 'TWILIO_PHONE_NUMBER is not set')
    assert(process.env.MY_PHONE_NUMBER, 'MY_PHONE_NUMBER is not set')
    try {
      await this.twilio.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER,
      });
    } catch (error) {
      logger.error('Failed to send SMS notification', { error });
      throw error;
    }
  }
}
