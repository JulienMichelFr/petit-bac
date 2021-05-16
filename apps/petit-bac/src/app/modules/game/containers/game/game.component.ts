import { Component, OnDestroy } from '@angular/core';
import { SocketService } from '../../../../service/socket/socket.service';
import { WsMessagesName } from '@petit-bac/ws-shared';
import { GameFieldsInterface, GameRound, RoomStatus } from '@petit-bac/api-interfaces';
import { interval, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../interfaces/app-state.interface';
import {
  selectRoomCurrentLetter,
  selectRoomHasStatusDuration,
  selectRoomRounds,
  selectRoomStatus,
  selectRoomStatusDuration,
} from '../../../../store/selectors/room.selectors';

@Component({
  selector: 'petit-bac-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  roomStatus$: Observable<RoomStatus> = this.store.select(selectRoomStatus);
  currentLetter$: Observable<string> = this.store.select(selectRoomCurrentLetter);
  lastRoundResult$: Observable<GameRound> = this.store.select(selectRoomRounds).pipe(
    map((rounds) => {
      return rounds[rounds.length - 1];
    })
  );
  displayProgress$: Observable<boolean> = this.store.select(selectRoomHasStatusDuration);

  progress$: Observable<number> = this.store.select(selectRoomStatusDuration).pipe(
    distinctUntilChanged(),
    filter((duration) => duration > 0),
    switchMap((duration) => this.getProgress(duration))
  );

  readonly RoomStates = RoomStatus;

  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService, private store: Store<AppStateInterface>) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startGame(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_START_ROUND, { state: RoomStatus.STARTING }).subscribe();
  }

  sendResult(result: GameFieldsInterface): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_SEND_RESULT, { result }).subscribe();
  }

  private getProgress(duration: number): Observable<number> {
    return interval(100).pipe(
      map((sec) => {
        return (sec * 10000) / duration;
      }),
      takeWhile((progress) => progress < 101)
    );
  }
}
