import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  RoomJoinMessage,
  RoomMessage,
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  RoomUpdateMessage,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { PlayerInterface, RoomInterface } from '@petit-bac/api-interfaces';

@WebSocketGateway()
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger = new Logger(RoomGateway.name);

  constructor(private roomService: RoomService) {
    this.logger.log('Loaded');
  }

  @SubscribeMessage(WsMessagesName.ROOM_JOIN)
  joinRoom(@MessageBody() { roomId }: RoomJoinMessage, @ConnectedSocket() client: Socket): void {
    const room = this.roomService.getRoom(roomId);
    room.players.push(client.data);
    const updated = this.roomService.updateRoom(room);
    client.join(roomId);
    const response: RoomUpdatePlayersMessage = { players: updated.players };
    this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE_PLAYERS, response);
  }

  @SubscribeMessage(WsMessagesName.ROOM_PLAYER_CHAT)
  playerAction(@MessageBody() message: RoomPlayerChatMessage, @ConnectedSocket() socket: Socket): void {
    const response: RoomPlayerChatDispatchMessage = {
      message: message.message,
      player: socket.data,
    };
    this.server.to(message.roomId).emit(WsMessagesName.ROOM_PLAYER_CHAT, response);
  }

  @SubscribeMessage(WsMessagesName.ROOM_GET)
  getState(@MessageBody() { roomId }: RoomMessage): RoomInterface {
    return this.roomService.getRoom(roomId);
  }

  @SubscribeMessage(WsMessagesName.ROOM_UPDATE_STATE)
  updateState(@MessageBody() { roomId }: RoomUpdateMessage): void {
    const response: RoomUpdateMessage = { roomId, state: 'starting' };
    this.roomService.updateRoom({ id: roomId, state: 'starting' });
    this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE_STATE, response);
    setTimeout(() => {
      this.roomService.updateRoom({ id: roomId, state: 'started' });
      this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE_STATE, { ...response, state: 'started' });
    }, 10 * 1000);

    setTimeout(() => {
      this.roomService.updateRoom({ id: roomId, state: 'ended' });
      this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE_STATE, { ...response, state: 'ended' });
    }, 60 * 1000);
  }

  handleDisconnect(client: Socket): void {
    const rooms = this.roomService.disconnectPlayer(client.data);
    for (const room of rooms) {
      const response: RoomUpdatePlayersMessage = { players: room.players };
      this.server.to(room.id).emit(WsMessagesName.ROOM_UPDATE_PLAYERS, response);
    }

    this.logger.log(`Player ${(<PlayerInterface>client.data)?.username} disconnected`);
  }
}
