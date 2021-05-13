import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppStateInterface } from '../../../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectRouteParam } from '../../../../store/selectors/router.selectors';
import {
  RoomPlayerChatDispatchMessage,
  RoomPlayerChatMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { scan, skipWhile, switchMap } from 'rxjs/operators';
import { PlayerChatForm } from '../../components/chat-input/chat-input.component';

@Injectable()
export class ChatService {
  roomId$: Observable<string> = this.store.select(selectRouteParam('id'));

  messages$: Observable<
    RoomPlayerChatDispatchMessage[]
  > = this.socket
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

  constructor(
    private socket: Socket,
    private store: Store<AppStateInterface>
  ) {}

  sendMessage(chatForm: PlayerChatForm): Observable<unknown> {
    return this.roomId$.pipe(
      skipWhile((id) => !id),
      switchMap((roomId) => {
        const message: RoomPlayerChatMessage = { ...chatForm, roomId };
        return of(this.socket.emit(WsMessagesName.ROOM_PLAYER_CHAT, message));
      })
    );
  }
}
