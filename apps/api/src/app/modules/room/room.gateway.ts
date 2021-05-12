import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  PlayerInterface,
  RoomJoinMessage,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/api-interfaces';

@WebSocketGateway()
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger = new Logger(RoomGateway.name);

  constructor(private roomService: RoomService) {
    this.logger.log('Loaded');
  }

  @SubscribeMessage(WsMessagesName.ROOMS_JOIN)
  joinRoom(
    @MessageBody() { roomId }: RoomJoinMessage,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.roomService.getRoom(roomId);
    room.players.push(client.data);
    const updated = this.roomService.updateRoom(room);
    client.join(roomId);
    const response: RoomUpdatePlayersMessage = { players: updated.players };
    this.server.to(roomId).emit(WsMessagesName.ROOMS_UPDATE_PLAYERS, response);
  }

  handleDisconnect(client: Socket): void {
    const rooms = this.roomService.disconnectPlayer(client.data);
    for (const room of rooms) {
      const response: RoomUpdatePlayersMessage = { players: room.players };
      this.server
        .to(room.id)
        .emit(WsMessagesName.ROOMS_UPDATE_PLAYERS, response);
    }

    this.logger.log(
      `Player ${(<PlayerInterface>client.data)?.username} disconnected`
    );
  }
}
