import { Pipe, PipeTransform } from '@angular/core';
import { RoomStatus } from '@petit-bac/api-interfaces';

@Pipe({
  name: 'gameState',
})
export class GameStatePipe implements PipeTransform {
  transform(value: RoomStatus): string {
    switch (value) {
      case RoomStatus.lobby:
        return 'Game will start soon';
      case RoomStatus.starting:
        return 'Game is starting ...';
      case RoomStatus.started:
        return 'Game is in progress ...';
      case RoomStatus.ended:
        return 'Game has ended';
    }
  }
}
