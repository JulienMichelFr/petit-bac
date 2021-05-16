import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  RoomSendResult,
  RoomUpdateMessage,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { PlayerInterface, RoomInterface, RoomStatus } from '@petit-bac/api-interfaces';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { GAME_DURATION, GAME_START_DELAY } from '../../../environments/environment';
import { Room } from './room.decorator';

@WebSocketGateway()
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger = new Logger(RoomGateway.name);

  constructor(private roomService: RoomService) {
    this.logger.log('Loaded');
  }

  @SubscribeMessage(WsMessagesName.ROOM_JOIN)
  joinRoom(@ConnectedSocket() client: Socket, @Room() room: RoomInterface): void {
    room.players.push(client.data);
    const updated = this.roomService.updateRoom(room);
    client.join(room.id);
    this.sendToRoomUpdate(room.id, updated);
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
  getState(@Room() room: RoomInterface): RoomInterface {
    return room;
  }

  @SubscribeMessage(WsMessagesName.ROOM_UPDATE_STATE)
  updateState(@MessageBody() { roomId }: RoomUpdateMessage): void {
    const updatedRoom = this.roomService.updateRoom({ id: roomId, state: RoomStatus.starting, statusDuration: GAME_START_DELAY });
    this.sendToRoomUpdate(roomId, updatedRoom);

    this.startRoom(roomId)
      .pipe(switchMap(() => this.endRoom(roomId)))
      .subscribe();
  }

  @SubscribeMessage(WsMessagesName.ROOM_SEND_RESULT)
  receiveResult(@MessageBody() { roomId, result }: RoomSendResult, @ConnectedSocket() socket: Socket): void {
    const player = socket.data;
    this.roomService.addRoundForRoom(roomId, { result, player });
  }

  handleDisconnect(client: Socket): void {
    const rooms = this.roomService.disconnectPlayer(client.data);
    for (const room of rooms) {
      const response: RoomUpdatePlayersMessage = { players: room.players };
      this.server.to(room.id).emit(WsMessagesName.ROOM_UPDATE_PLAYERS, response);
    }

    this.logger.log(`Player ${(<PlayerInterface>client.data)?.username} disconnected`);
  }

  private startRoom(roomId: string): Observable<boolean> {
    return of(null).pipe(
      delay(GAME_START_DELAY + 1000),
      map(() => {
        const room: RoomInterface = this.roomService.startRoundForRoom(roomId);
        return this.sendToRoomUpdate(roomId, room);
      })
    );
  }

  private endRoom(roomId): Observable<boolean> {
    return of(null).pipe(
      delay(GAME_DURATION + 1000),
      map(() => {
        const room: RoomInterface = this.roomService.updateRoom({ id: roomId, state: RoomStatus.ended, statusDuration: 0 });
        return this.sendToRoomUpdate(roomId, room);
      })
    );
  }

  private sendToRoomUpdate(roomId: string, updatedRoom: RoomInterface): boolean {
    return this.sendToRoom(roomId, WsMessagesName.ROOM_UPDATE, updatedRoom);
  }

  private sendToRoom(roomId: string, type: WsMessagesName.ROOM_UPDATE, payload: RoomInterface): boolean;
  private sendToRoom(roomId: string, type: WsMessagesName, payload?: unknown): boolean {
    return this.server.to(roomId).emit(type, payload);
  }
}
