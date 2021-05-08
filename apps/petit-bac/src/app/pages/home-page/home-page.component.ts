import { Component } from '@angular/core';
import { UserInterface } from '@petit-bac/api-interfaces';
import { RoomService } from '../../modules/room/service/room/room.service';
import { RoomInterface } from '../../../../../../libs/api-interfaces/src/lib/room.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'petit-bac-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  public user: UserInterface = { username: '' };

  constructor(private roomService: RoomService, private router: Router) {}

  updateUser(user: UserInterface): void {
    this.user = user;
  }

  createRoom() {
    this.roomService.createRoom().subscribe((room: RoomInterface) => {
      this.router.navigate(['rooms', room.id]);
    });
  }
}
