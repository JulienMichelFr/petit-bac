import { Component } from '@angular/core';
import { PlayerInterface, RoomInterface } from '@petit-bac/api-interfaces';
import { RoomService } from '../../modules/room/service/room/room.service';
import { Router } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { setProfile } from '../../store/actions/profile.actions';
import { Observable } from 'rxjs';
import { hasProfile } from '../../store/selectors/profile.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'petit-bac-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  player: PlayerInterface = { username: '' };
  joinDisabled$: Observable<boolean> = this.store
    .select(hasProfile)
    .pipe(map((hasProfile) => !hasProfile));

  constructor(
    private roomService: RoomService,
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  updateUser(player: PlayerInterface): void {
    this.player = player;
    this.store.dispatch(setProfile({ profile: player }));
  }

  createRoom() {
    this.roomService.createRoom().subscribe((room: RoomInterface) => {
      this.router.navigate(['rooms', room.id]);
    });
  }
}
