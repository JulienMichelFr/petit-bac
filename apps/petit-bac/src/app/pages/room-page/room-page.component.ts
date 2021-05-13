import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { map, skipWhile, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { hasProfile } from '../../store/selectors/profile.selectors';
import { RoomUpdatePlayersMessage, WsMessagesName } from '@petit-bac/ws-shared';
import { SocketService } from '../../service/socket/socket.service';

@Component({
  selector: 'petit-bac-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss'],
})
export class RoomPageComponent implements OnInit {
  link: string;
  players$: Observable<
    PlayerInterface[]
  > = this.socketService
    .fromEvent<RoomUpdatePlayersMessage>(WsMessagesName.ROOM_UPDATE_PLAYERS)
    .pipe(map((message) => message.players));
  connected = false;

  constructor(
    private store: Store<AppStateInterface>,
    private clipboard: Clipboard,
    private snackbarService: MatSnackBar,
    private socketService: SocketService
  ) {
    this.link = window.location.href + '/invite';
  }

  ngOnInit(): void {
    this.connectToRoom();
  }

  copyLink() {
    this.clipboard.copy(this.link);
    this.snackbarService.open('Link copied !', null, { duration: 3000 });
  }

  private connectToRoom(): void {
    this.store
      .select(hasProfile)
      .pipe(
        skipWhile((hasProfile) => !hasProfile),
        take(1),
        switchMap(() => {
          return this.socketService.sendRoomMessage(
            WsMessagesName.ROOM_JOIN,
            {}
          );
        })
      )
      .subscribe(() => {
        this.connected = true;
      });
  }
}
