import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PlayerInterface } from '@petit-bac/api-interfaces';

@Component({
  selector: 'petit-bac-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input() players: PlayerInterface[];
}
