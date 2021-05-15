import { Component, OnDestroy } from '@angular/core';
import { SocketService } from '../../../../service/socket/socket.service';
import { WsMessagesName } from '@petit-bac/ws-shared';
import { GameFieldsInterface, GameRound, RoomStatus } from '@petit-bac/api-interfaces';
import { interval, Observable, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../interfaces/app-state.interface';
import { selectRoomCurrentLetter, selectRoomRounds, selectRoomStatus } from '../../../../store/selectors/room.selectors';

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
  progress$: Observable<number>;

  readonly RoomStates = RoomStatus;

  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService, private store: Store<AppStateInterface>) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startGame(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_UPDATE_STATE, { state: RoomStatus.starting }).subscribe();
  }

  sendResult(result: GameFieldsInterface): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_SEND_RESULT, { result }).subscribe();
  }

  private setProgress(duration: number): void {
    this.progress$ = interval(100).pipe(
      map((sec) => {
        return (sec * 10000) / duration;
      }),
      takeWhile((progress) => progress <= 100)
    );
  }
}
