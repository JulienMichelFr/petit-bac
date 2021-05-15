import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  RoomJoinMessage,
  RoomMessage,
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  RoomSendResult,
  RoomUpdateMessage,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { PlayerInterface, RoomInterface } from '@petit-bac/api-interfaces';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

const GAME_START_DELAY = 10 * 1000;
const GAME_DURATION = 60 * 1000;

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
    const response: RoomUpdateMessage = { roomId, state: 'starting', duration: GAME_START_DELAY };
    this.roomService.updateRoom({ id: roomId, state: 'starting' });
    this.server.to(roomId).emit(WsMessagesName.ROOM_UPDATE_STATE, response);

    this.startRoom(roomId)
      .pipe(switchMap(() => this.endRoom(roomId)))
      .subscribe();
  }

  @SubscribeMessage(WsMessagesName.ROOM_SEND_RESULT)
  receiveResult(@MessageBody() { roomId, result, letter }: RoomSendResult, @ConnectedSocket() socket: Socket): void {
    const player = socket.data;
    this.roomService.addRoundForRoom(roomId, { letter, result, player });
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
        const message: RoomUpdateMessage = {
          roomId,
          state: room.state,
          data: room.currentLetter,
          duration: GAME_DURATION,
        };
        return this.sendToRoom(roomId, WsMessagesName.ROOM_UPDATE_STATE, message);
      })
    );
  }

  private endRoom(roomId): Observable<boolean> {
    return of(null).pipe(
      delay(GAME_DURATION + 1000),
      map(() => {
        const room: RoomInterface = this.roomService.updateRoom({ id: roomId, state: 'ended' });
        return this.sendToRoom(roomId, WsMessagesName.ROOM_UPDATE_STATE, {
          roomId,
          state: 'ended',
          data: room.rounds,
        });
      })
    );
  }

  private sendToRoom(roomId, type: WsMessagesName.ROOM_UPDATE_STATE, payload: RoomUpdateMessage): boolean;
  private sendToRoom(roomId: string, type: WsMessagesName, payload?: RoomMessage): boolean {
    return this.server.to(roomId).emit(type, payload);
  }
}
