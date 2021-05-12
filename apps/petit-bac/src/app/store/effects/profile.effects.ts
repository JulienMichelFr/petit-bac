import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Socket } from 'ngx-socket-io';
import { setProfile } from '../actions/profile.actions';
import { debounceTime, tap } from 'rxjs/operators';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { selectProfile } from '../selectors/profile.selectors';
import { PlayerUpdateMessage, WsMessagesName } from '@petit-bac/api-interfaces';

@Injectable()
export class ProfileEffects {
  updateProfile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setProfile),
        debounceTime(1000),
        concatLatestFrom(() => this.store.select(selectProfile)),
        tap(([, profile]) => {
          const message: PlayerUpdateMessage = { player: profile };
          this.socket.emit(WsMessagesName.PLAYER_UPDATE, message);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private socket: Socket,
    private store: Store<AppStateInterface>
  ) {}
}
