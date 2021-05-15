import { PlayerInterface } from './player.interface';
import { GameRound } from './game-fields.interface';

export enum RoomStatus {
  lobby,
  starting,
  started,
  ended,
}

export interface RoomInterface {
  id: string;
  players: PlayerInterface[];
  state: RoomStatus;
  rounds: GameRound[];
  currentLetter: string;
  statusDuration: number;
}
