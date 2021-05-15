import { Pipe, PipeTransform } from '@angular/core';
import { RoomState } from '@petit-bac/api-interfaces';

@Pipe({
  name: 'gameState',
})
export class GameStatePipe implements PipeTransform {
  transform(value: RoomState): string {
    switch (value) {
      case RoomState.lobby:
        return 'Game will start soon';
      case RoomState.starting:
        return 'Game is starting ...';
      case RoomState.started:
        return 'Game is in progress ...';
      case RoomState.ended:
        return 'Game has ended';
    }
  }
}
