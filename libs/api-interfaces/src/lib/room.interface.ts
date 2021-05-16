import { PlayerInterface } from './player.interface';
import { GameRound } from './game-fields.interface';

export enum RoomStatus {
  LOBBY,
  STARTING,
  IN_ROUND,
  END_ROUND,
  END_GAME,
}

export interface RoomInterface {
  id: string;
  players: PlayerInterface[];
  status: RoomStatus;
  rounds: GameRound[];
  currentLetter: string;
  statusDuration: number;
  roundLeft: number;
}
