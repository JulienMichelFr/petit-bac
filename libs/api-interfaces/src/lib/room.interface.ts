import { PlayerInterface } from './player.interface';
import { GameRound } from './game-fields.interface';

export enum RoomState {
  lobby,
  starting,
  started,
  ended,
}

export interface RoomInterface {
  id: string;
  players: PlayerInterface[];
  state: RoomState;
  rounds: GameRound[];
  currentLetter?: string;
}
