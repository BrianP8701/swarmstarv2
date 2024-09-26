import { injectable, inject } from 'inversify';
import { PubSubTopic } from '../PubSubTopic';
import { WebSocketPayload, WebSocketMessageType } from '../payload/WebSocketPayload';
import { NonCloudFunctionHandler } from '../NonCloudFunctionHandler';
import { WebSocketService } from '../../../services/WebsocketService';
import { PubSub } from 'graphql-subscriptions';
import { formatDbChatWithMessagesToGqlChat } from '../../../graphql/formatters/chatFormatters';
import { ChatDao } from '../../../dao/ChatDao';

const pubsub = new PubSub();

@injectable()
export class WebSocketHandler extends NonCloudFunctionHandler<PubSubTopic.WebSocketHandler> {
  constructor(
    @inject(WebSocketService) private webSocketService: WebSocketService,
    @inject(ChatDao) private chatDao: ChatDao
  ) {
    super();
  }

  public getTopic(): PubSubTopic.WebSocketHandler {
    return PubSubTopic.WebSocketHandler;
  }

  public async handle(payload: WebSocketPayload): Promise<void> {
    switch (payload.type) {
      case WebSocketMessageType.CHAT_MESSAGE:
        const connection = this.webSocketService.getConnection(payload.userId);
        if (connection) {
          const chat = await this.chatDao.getWithMessages(payload.body.chatId);
          const formattedChat = formatDbChatWithMessagesToGqlChat(chat);
          // Replace this line
          // await this.webSocketServer.sendMessageToUser(payload.userId, formattedChat);
          await this.webSocketService.sendMessageToUser(payload.userId, formattedChat);
          await pubsub.publish(`MESSAGE_SENT_${payload.userId}`, { messageSent: formattedChat });
        }
        break;
    }
  }
}
