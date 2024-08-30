import { Twilio } from 'twilio';
import { inject, injectable } from 'inversify';
import { logger } from '../../utils/logging/logger';
import { SecretService } from '../SecretService';

@injectable()
export class TwilioService {
  private twilio: Twilio;

  constructor(
    @inject(SecretService) private secretService: SecretService
  ) {
    this.twilio = new Twilio(
      this.secretService.getTwilioAccountSid(),
      this.secretService.getTwilioAuthToken()
    );
  }

  async sendSms(message: string): Promise<void> {
    try {
      await this.twilio.messages.create({
        body: message,
        from: this.secretService.getTwilioPhoneNumber(),
        to: this.secretService.getMyPhoneNumber(),
      });
    } catch (error) {
      logger.error('Failed to send SMS notification', { error });
      throw error;
    }
  }
}
