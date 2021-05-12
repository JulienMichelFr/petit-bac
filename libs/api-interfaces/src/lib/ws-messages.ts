import { PlayerInterface } from './player.interface';

export enum WsMessagesName {
  ROOMS_JOIN = 'rooms:join',
  ROOMS_UPDATE_PLAYERS = 'rooms:update-players',
  PLAYER_UPDATE = 'player:update',
}

export interface RoomUpdatePlayersMessage {
  players: PlayerInterface[];
}

export interface PlayerUpdateMessage {
  player: PlayerInterface;
}

export interface RoomJoinMessage {
  roomId: string;
}
