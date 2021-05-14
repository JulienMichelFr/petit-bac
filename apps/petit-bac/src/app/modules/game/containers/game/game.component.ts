import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../../../service/socket/socket.service';
import { RoomUpdateMessage, WsMessagesName } from '@petit-bac/ws-shared';
import { GameFieldsInterface, RoomState } from '@petit-bac/api-interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'petit-bac-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  state: RoomState = 'before';

  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_GET).subscribe(({ state }) => {
      this.state = state;
    });
    this.checkGameState();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startGame(): void {
    this.socketService.sendRoomMessage(WsMessagesName.ROOM_UPDATE_STATE, { state: 'starting' }).subscribe();
  }

  sendResult(result: GameFieldsInterface): void {
    console.log({ result });
  }

  private checkGameState(): void {
    this.subscription.add(
      this.socketService.fromEvent<RoomUpdateMessage>(WsMessagesName.ROOM_UPDATE_STATE).subscribe(({ state }) => (this.state = state))
    );
  }
}
