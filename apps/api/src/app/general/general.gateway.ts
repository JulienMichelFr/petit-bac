import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { PlayerUpdateMessage, WsMessagesName } from '@petit-bac/ws-shared';

@WebSocketGateway()
export class GeneralGateway {
  private logger = new Logger(GeneralGateway.name);

  constructor() {
    this.logger.log('Loaded');
  }

  @SubscribeMessage(WsMessagesName.PLAYER_UPDATE)
  playerUpdate(
    @MessageBody() { player }: PlayerUpdateMessage,
    @ConnectedSocket() client
  ): void {
    this.logger.log('Update player');
    client.data = player;
  }
}
