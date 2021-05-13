import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectRouteParam } from '../../store/selectors/router.selectors';
import {
  PlayerUpdateMessage,
  RoomJoinMessage,
  RoomMessage,
  RoomPlayerChatMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { skipWhile, switchMap } from 'rxjs/operators';

type WithoutRoomId<T extends { roomId: string }> = Omit<T, 'roomId'>;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  roomId$: Observable<string> = this.store.select(selectRouteParam('id'));

  constructor(
    private socket: Socket,
    private store: Store<AppStateInterface>
  ) {}

  fromEvent<T>(type: WsMessagesName): Observable<T> {
    return this.socket.fromEvent<T>(type);
  }

  sendRoomMessage(
    type: WsMessagesName.ROOM_JOIN,
    payload: WithoutRoomId<RoomJoinMessage>
  ): Observable<unknown>;
  sendRoomMessage(
    type: WsMessagesName.ROOM_PLAYER_CHAT,
    payload: WithoutRoomId<RoomPlayerChatMessage>
  ): Observable<unknown>;
  sendRoomMessage(
    type: WsMessagesName,
    payload: WithoutRoomId<RoomMessage>
  ): Observable<unknown> {
    return this.roomId$.pipe(
      skipWhile((id) => !id),
      switchMap((roomId) => {
        const message: RoomMessage = { ...payload, roomId };
        return of(this.socket.emit(type, message));
      })
    );
  }

  emit(type: WsMessagesName.PLAYER_UPDATE, payload: PlayerUpdateMessage) {
    this.socket.emit(type, payload);
  }
}
