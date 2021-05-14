import { PlayerInterface } from './player.interface';

export interface GameFieldsInterface {
  fruitOrVegetable: string;
  cityOrCountry: string;
  job: string;
  animal: string;
  girlName: string;
  movieOrTvShow: string;
}
export interface PlayerResult {
  player: PlayerInterface;
  result: GameFieldsInterface;
}

export type PlayerResultWithLetter = PlayerResult & { letter: string };

export interface GameRound {
  letter: string;
  results: PlayerResult[];
}
