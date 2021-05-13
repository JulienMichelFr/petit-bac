import { PlayerInterface } from '@petit-bac/api-interfaces';

export interface RoomUpdatePlayersMessage {
  players: PlayerInterface[];
}

export interface RoomMessage {
  roomId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RoomJoinMessage extends RoomMessage {}

export interface RoomPlayerActionMessage extends RoomMessage {
  action: string;
}
