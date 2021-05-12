import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import {
  PlayerInterface,
  RoomJoinMessage,
  RoomUpdatePlayersMessage,
  WsMessagesName,
} from '@petit-bac/api-interfaces';
import { ActivatedRoute } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'petit-bac-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss'],
})
export class RoomPageComponent implements OnInit {
  link: string;
  players$: Observable<
    PlayerInterface[]
  > = this.socket
    .fromEvent<RoomUpdatePlayersMessage>(WsMessagesName.ROOMS_UPDATE_PLAYERS)
    .pipe(map((message) => message.players));
  connected = false;
  roomId: string = this.route.snapshot.paramMap.get('id');

  constructor(
    private store: Store<AppStateInterface>,
    private clipboard: Clipboard,
    private snackbarService: MatSnackBar,
    private socket: Socket,
    private route: ActivatedRoute
  ) {
    this.link = window.location.href + '/invite';
  }

  ngOnInit(): void {
    this.connectToRoom();
    this.players$.subscribe(console.log, console.error);
  }

  copyLink() {
    this.clipboard.copy(this.link);
    this.snackbarService.open('Link copied !');
  }

  private connectToRoom(): void {
    const message: RoomJoinMessage = {
      roomId: this.roomId,
    };
    this.socket.emit(WsMessagesName.ROOMS_JOIN, message);
    this.connected = true;
  }
}
