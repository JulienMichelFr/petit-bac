import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../../../service/socket/socket.service';
import { RoomUpdateMessage, WsMessagesName } from '@petit-bac/ws-shared';
import { GameFieldsInterface, GameRound, RoomState } from '@petit-bac/api-interfaces';
import { interval, Observable, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'petit-bac-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  state: RoomState = RoomState.lobby;
  letter = 'A';
  results: GameRound[] = null;

  progress$: Observable<number>;

  readonly RoomStates = RoomState;

  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_GET).subscribe(({ state, currentLetter, rounds }) => {
      this.state = state;
      this.letter = currentLetter;
      this.results = rounds;
    });
    this.checkGameState();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startGame(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_UPDATE_STATE, { state: RoomState.starting }).subscribe();
  }

  sendResult(result: GameFieldsInterface): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_SEND_RESULT, { letter: this.letter, result }).subscribe();
  }

  private checkGameState(): void {
    this.subscription.add(
      this.socketService.fromEvent<RoomUpdateMessage>(WsMessagesName.ROOM_UPDATE_STATE).subscribe(({ state, data, duration }) => {
        switch (state) {
          case RoomState.ended:
            if (data) {
              this.results = data as GameRound[];
            }
            break;
          case RoomState.started:
            if (data) {
              this.letter = data as string;
            }
            break;
        }
        if (duration) {
          this.setProgress(duration);
        }

        this.state = state;
      })
    );
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
