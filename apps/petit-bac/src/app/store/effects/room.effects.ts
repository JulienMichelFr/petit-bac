import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SocketService } from '../../service/socket/socket.service';
import { getRoom, getRoomFail, getRoomSuccess, updateRoom } from '../actions/room.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WsMessagesName } from '@petit-bac/ws-shared';
import { RoomInterface } from '@petit-bac/api-interfaces';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class RoomEffects {
  updateRoom = createEffect(() => {
    return this.socketService.fromEvent<RoomInterface>(WsMessagesName.ROOM_UPDATE).pipe(map((room) => updateRoom({ room })));
  });

  getRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRoom),
      switchMap(() => {
        return this.socketService.sendRoomMessage(WsMessagesName.ROOM_GET);
      }),
      map<RoomInterface, Action>((room) => {
        return getRoomSuccess({ room });
      }),
      catchError((error) => of(getRoomFail({ error })))
    )
  );

  constructor(private actions$: Actions, private socketService: SocketService) {}
}
