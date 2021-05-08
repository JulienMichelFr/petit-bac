import { Component } from '@angular/core';
import { UserInterface } from '@petit-bac/api-interfaces';
import { RoomService } from '../../modules/room/service/room/room.service';
import { RoomInterface } from '../../../../../../libs/api-interfaces/src/lib/room.interface';
import { Router } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { setProfile } from '../../store/actions/profile.actions';

@Component({
  selector: 'petit-bac-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  user: UserInterface = { username: '' };
  constructor(
    private roomService: RoomService,
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  updateUser(user: UserInterface): void {
    this.user = user;
    this.store.dispatch(setProfile({ user: user }));
  }

  createRoom() {
    this.roomService.createRoom().subscribe((room: RoomInterface) => {
      this.router.navigate(['rooms', room.id]);
    });
  }
}
