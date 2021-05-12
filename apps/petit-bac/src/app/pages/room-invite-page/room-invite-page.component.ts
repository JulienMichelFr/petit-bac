import { Component } from '@angular/core';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { setProfile } from '../../store/actions/profile.actions';

@Component({
  selector: 'petit-bac-room-invite-page',
  templateUrl: './room-invite-page.component.html',
  styleUrls: ['./room-invite-page.component.scss'],
})
export class RoomInvitePageComponent {
  player: PlayerInterface = { username: '' };

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateUser(player: PlayerInterface) {
    this.player = player;
    this.store.dispatch(setProfile({ profile: player }));
  }

  joinRoom() {
    this.router.navigate(['../'], { relativeTo: this.route }).catch((err) => {
      console.error(err);
    });
  }
}
