import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'petit-bac-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss'],
})
export class RoomPageComponent {
  link: string;

  constructor(
    private clipboard: Clipboard,
    private snackbarService: MatSnackBar
  ) {
    this.link = window.location.href + '/invite';
  }

  copyLink() {
    this.clipboard.copy(this.link);
    this.snackbarService.open('Link copied !');
  }
}
