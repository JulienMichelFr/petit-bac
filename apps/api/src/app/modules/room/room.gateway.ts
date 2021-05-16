import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  RoomSendResult,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { PlayerInterface, RoomInterface } from '@petit-bac/api-interfaces';
import { Room } from './room.decorator';
import { Player } from '../../general/player.decorator';
import { RoomModel } from '../../models/room.model';

@WebSocketGateway()
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger = new Logger(RoomGateway.name);

  constructor(private roomService: RoomService) {
    this.logger.log('Loaded');
  }

  @SubscribeMessage(WsMessagesName.ROOM_JOIN)
  joinRoom(@ConnectedSocket() client: Socket, @Room() room: RoomModel, @Player() player: PlayerInterface): void {
    room.addPlayer(player);
    client.join(room.id);
    this.sendToRoomUpdate(room.id, room);
  }

  @SubscribeMessage(WsMessagesName.ROOM_PLAYER_CHAT)
  receiveChatMessage(@MessageBody() message: RoomPlayerChatMessage, @Player() player: PlayerInterface): void {
    const response: RoomPlayerChatDispatchMessage = {
      message: message.message,
      player,
    };
    this.server.to(message.roomId).emit(WsMessagesName.ROOM_PLAYER_CHAT, response);
  }

  @SubscribeMessage(WsMessagesName.ROOM_GET)
  getState(@Room() room: RoomInterface): RoomInterface {
    return room;
  }

  @SubscribeMessage(WsMessagesName.ROOM_START)
  updateState(@Room() room: RoomModel): void {
    room.runGame().subscribe((roomResult) => {
      this.sendToRoomUpdate(roomResult.id, roomResult);
    });
  }

  @SubscribeMessage(WsMessagesName.ROOM_SEND_RESULT)
  receiveResult(@MessageBody() { result }: RoomSendResult, @Player() player: PlayerInterface, @Room() room: RoomModel): void {
    room.addRound({ result, player });
  }

  handleDisconnect(client: Socket): void {
    const rooms = this.roomService.disconnectPlayer(client.data);
    for (const room of rooms) {
      const response: RoomUpdatePlayersMessage = { players: room.players };
      this.server.to(room.id).emit(WsMessagesName.ROOM_UPDATE_PLAYERS, response);
    }

    this.logger.log(`Player ${(<PlayerInterface>client.data)?.username} disconnected`);
  }

  private sendToRoomUpdate(roomId: string, updatedRoom: RoomInterface): boolean {
    return this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE, updatedRoom);
  }
}
