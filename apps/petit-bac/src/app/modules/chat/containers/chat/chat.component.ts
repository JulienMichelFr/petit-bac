import { Component } from '@angular/core';
import {
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { ActivatedRoute } from '@angular/router';
import { PlayerChatForm } from '../../components/chat-input/chat-input.component';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'petit-bac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  roomId = this.route.snapshot.paramMap.get('id');
  actions$: Observable<
    RoomPlayerChatDispatchMessage[]
  > = this.socket
    .fromEvent<RoomPlayerChatDispatchMessage>(WsMessagesName.ROOM_PLAYER_ACTION)
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

  constructor(private socket: Socket, private route: ActivatedRoute) {}

  sendAction(action: PlayerChatForm): void {
    const message: RoomPlayerChatMessage = { ...action, roomId: this.roomId };
    this.socket.emit(WsMessagesName.ROOM_PLAYER_ACTION, message);
  }
}
