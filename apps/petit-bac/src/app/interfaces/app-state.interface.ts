import { PlayerInterface } from '@petit-bac/api-interfaces';
import { RouterState } from '@ngrx/router-store';
import { RoomState } from '../store/reducers/room.reducer';

export interface AppStateInterface {
  profile?: PlayerInterface;
  room: RoomState;
  router?: RouterState;
}
