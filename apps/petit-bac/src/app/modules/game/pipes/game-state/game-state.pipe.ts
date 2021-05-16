import { Pipe, PipeTransform } from '@angular/core';
import { RoomStatus } from '@petit-bac/api-interfaces';

@Pipe({
  name: 'gameState',
})
export class GameStatePipe implements PipeTransform {
  transform(value: RoomStatus): string {
    switch (value) {
      case RoomStatus.END_GAME:
        return 'Game is over';
      case RoomStatus.LOBBY:
        return 'Game will start soon';
      case RoomStatus.STARTING:
        return 'Game is starting ...';
      case RoomStatus.IN_ROUND:
        return 'Game is in progress ...';
      case RoomStatus.END_ROUND:
        return 'Round has ended';
    }
  }
}
