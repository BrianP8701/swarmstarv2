import { injectable, inject } from 'inversify';
import { PubSubTopic } from '../PubSubTopic';
import { WebSocketPayload, WebSocketMessageType } from '../payload/WebSocketPayload';
import { NonCloudFunctionHandler } from '../NonCloudFunctionHandler';
import { ChatDao } from '../../../dao/ChatDao';
import { pubsub, WebsocketTopic } from '../../../graphql/resolvers/subscriptions';
import { logger } from '../../../utils/logging/logger';

@injectable()
export class WebSocketHandler extends NonCloudFunctionHandler<PubSubTopic.WebSocketHandler> {
  constructor(
    @inject(ChatDao) private chatDao: ChatDao
  ) {
    super();
  }

  public getTopic(): PubSubTopic.WebSocketHandler {
    return PubSubTopic.WebSocketHandler;
  }

  public async handleEvent(payload: WebSocketPayload): Promise<void> {
    let message;
    switch (payload.type) {
      case WebSocketMessageType.NEW_MESSAGE:
        logger.info(`Sending message to user ${payload.userId}`);
        message = await this.chatDao.getMessage(payload.body.messageId);
        await pubsub.publish(`${WebsocketTopic.NEW_MESSAGE}_${payload.userId}_${message.chatId}`, { messageSent: message });
        break;
    }
  }
}
