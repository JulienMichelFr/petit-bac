import { PlayerInterface } from './player.interface';

export interface RoomInterface {
  id: string;
  players: PlayerInterface[];
}
