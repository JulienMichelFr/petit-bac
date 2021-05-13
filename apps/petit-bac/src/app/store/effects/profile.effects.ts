import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { setProfile } from '../actions/profile.actions';
import { tap } from 'rxjs/operators';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { selectProfile } from '../selectors/profile.selectors';
import { PlayerUpdateMessage, WsMessagesName } from '@petit-bac/ws-shared';
import { SocketService } from '../../service/socket/socket.service';

@Injectable()
export class ProfileEffects {
  updateProfile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setProfile, '@ngrx/effects/init'),
        concatLatestFrom(() => this.store.select(selectProfile)),
        tap(([, profile]) => {
          if (profile?.username) {
            const message: PlayerUpdateMessage = { player: profile };
            this.socketService.emit(WsMessagesName.PLAYER_UPDATE, message);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private socketService: SocketService, private store: Store<AppStateInterface>) {}
}
