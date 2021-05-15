import { Pipe, PipeTransform } from '@angular/core';
import { RoomState } from '@petit-bac/api-interfaces';

@Pipe({
  name: 'gameState',
})
export class GameStatePipe implements PipeTransform {
  transform(value: RoomState): string {
    switch (value) {
      case 'before':
        return 'Game will start soon';
      case 'starting':
        return 'Game is starting ...';
      case 'started':
        return 'Game is in progress ...';
      case 'ended':
        return 'Game has ended';
    }
  }
}
