import { Component } from '@angular/core';
import { UserInterface } from '@petit-bac/api-interfaces';
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
  user: UserInterface = { username: '' };

  constructor(
    private store: Store<AppStateInterface>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateUser(user: UserInterface) {
    this.user = user;
    this.store.dispatch(setProfile({ user }));
  }

  joinRoom() {
    console.log('called');
    this.router.navigate(['../'], { relativeTo: this.route }).catch((err) => {
      console.error(err);
    });
  }
}
