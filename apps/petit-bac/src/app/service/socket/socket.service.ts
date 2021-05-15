import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRouteParam } from '../../store/selectors/router.selectors';
import {
  PlayerUpdateMessage,
  RoomJoinMessage,
  RoomMessage,
  RoomPlayerChatMessage,
  RoomSendResult,
  RoomUpdateMessage,
  WsMessagesName,
} from '@petit-bac/ws-shared';
import { skipWhile, switchMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RoomInterface } from '@petit-bac/api-interfaces';

type WithoutRoomId<T extends { roomId: string }> = Omit<T, 'roomId'>;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  roomId$: Observable<string> = this.store.select(selectRouteParam('id'));

  constructor(private socket: Socket, private store: Store<AppStateInterface>) {
    if (!environment.production) {
      this.socket.ioSocket.onAny((eventName, ...args) => {
        const color = '#fff';
        const backgroundColor = '#27a52e';
        console.groupCollapsed(`%c[Received event] ${eventName}`, `background: ${backgroundColor}; color: ${color}`);
        console.log(...args);
        console.groupEnd();
      });
    }
  }

  fromEvent<T>(type: WsMessagesName): Observable<T> {
    return this.socket.fromEvent<T>(type);
  }

  fromSingleEvent<T>(type: WsMessagesName): Observable<T> {
    return this.fromEvent<T>(type).pipe(take(1));
  }

  sendRoomMessage(type: WsMessagesName.ROOM_GET): Observable<RoomInterface>;
  sendRoomMessage(type: WsMessagesName.ROOM_SEND_RESULT, payload: WithoutRoomId<RoomSendResult>): Observable<void>;
  sendRoomMessage(type: WsMessagesName.ROOM_UPDATE_STATE, payload: WithoutRoomId<RoomUpdateMessage>): Observable<void>;
  sendRoomMessage(type: WsMessagesName.ROOM_JOIN, payload: WithoutRoomId<RoomJoinMessage>): Observable<void>;
  sendRoomMessage(type: WsMessagesName.ROOM_PLAYER_CHAT, payload: WithoutRoomId<RoomPlayerChatMessage>): Observable<void>;
  sendRoomMessage<T>(type: WsMessagesName, payload: WithoutRoomId<RoomMessage> = {}): Observable<T> {
    return this.roomId$.pipe(
      skipWhile((id) => !id),
      switchMap((roomId) => {
        return new Observable<T>((subscriber) => {
          const message: RoomMessage = { ...payload, roomId };
          if (!environment.production) {
            const color = '#fff';
            const backgroundColor = '#5599ef';
            console.groupCollapsed(`%c[Sending event] ${type}`, `background: ${backgroundColor}; color: ${color}`);
            console.log(message);
            console.groupEnd();
          }
          this.socket.emit(type, message, (result: T) => {
            subscriber.next(result);
            subscriber.complete();
          });
        });
      })
    );
  }

  emit(type: WsMessagesName.PLAYER_UPDATE, payload: PlayerUpdateMessage) {
    this.socket.emit(type, payload);
  }
}
