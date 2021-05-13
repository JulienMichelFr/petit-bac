import { PlayerInterface } from './player.interface';

export type RoomState = 'before' | 'starting' | 'started' | 'ended';

export interface RoomInterface {
  id: string;
  players: PlayerInterface[];
  state?: RoomState;
}
