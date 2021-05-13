import { Component } from '@angular/core';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { setProfile } from '../../store/actions/profile.actions';
import { Observable } from 'rxjs';
import { hasProfile } from '../../store/selectors/profile.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'petit-bac-room-invite-page',
  templateUrl: './room-invite-page.component.html',
  styleUrls: ['./room-invite-page.component.scss'],
})
export class RoomInvitePageComponent {
  player: PlayerInterface = { username: '' };

  joinDisabled$: Observable<boolean> = this.store
    .select(hasProfile)
    .pipe(map((hasProfile) => !hasProfile));

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateUser(player: PlayerInterface) {
    this.player = player;
    this.store.dispatch(setProfile({ profile: player }));
  }

  joinRoom(): void {
    this.router.navigate(['../'], { relativeTo: this.route }).catch((err) => {
      console.error(err);
    });
  }
}
