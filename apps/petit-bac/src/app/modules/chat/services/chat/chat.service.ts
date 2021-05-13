import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RoomPlayerChatDispatchMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { scan } from 'rxjs/operators';
import { PlayerChatForm } from '../../components/chat-input/chat-input.component';
import { SocketService } from '../../../../service/socket/socket.service';

@Injectable()
export class ChatService {
  messages$: Observable<
    RoomPlayerChatDispatchMessage[]
  > = this.socketService
    .fromEvent<RoomPlayerChatDispatchMessage>(WsMessagesName.ROOM_PLAYER_CHAT)
    .pipe(
      scan(
        (
          acc: RoomPlayerChatDispatchMessage[],
          message: RoomPlayerChatDispatchMessage
        ) => {
          return [...acc, message];
        },
        []
      )
    );

  constructor(private socketService: SocketService) {}

  sendMessage(chatForm: PlayerChatForm): Observable<unknown> {
    return this.socketService.sendRoomMessage(
      WsMessagesName.ROOM_PLAYER_CHAT,
      chatForm
    );
  }
}
