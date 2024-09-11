import { injectable } from 'inversify'
import { PubSubTopic, TopicPayload } from './PubSubTopic'
import { PubSubMediator } from './PubSubMediator'
import { SecretService, Environment } from '../../services/SecretService'
import { PubSubHandler } from './PubSubHandler'
import { container } from '../../utils/di/container'

@injectable()
export abstract class NonCloudFunctionHandler<T extends PubSubTopic> implements PubSubHandler<T> {
  protected secretService: SecretService
  protected pubSubMediator: PubSubMediator
  constructor() {
    this.secretService = container.get(SecretService)
    this.pubSubMediator = container.get(PubSubMediator)
  }

  public abstract getTopic(): T;
  public abstract handle(payload: TopicPayload[T]): Promise<void>;

  public registerLocalHandler(): void {
    if (this.secretService.getEnvVars().MODE === Environment.LOCAL) {
      this.pubSubMediator.registerLocalHandler(this.getTopic(), this.handle.bind(this))
    }
  }
}
