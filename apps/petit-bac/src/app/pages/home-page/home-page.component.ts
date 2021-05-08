import { Component } from '@angular/core';
import { UserInterface } from '@petit-bac/api-interfaces';

@Component({
  selector: 'petit-bac-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  public user: UserInterface = { username: '' };

  updateUser(user: UserInterface): void {
    this.user = user;
  }

  createRoom() {
    console.log(this.user);
  }
}
