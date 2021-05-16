import { GameFieldsInterface, PlayerInterface } from '@petit-bac/api-interfaces';

export interface RoomUpdatePlayersMessage {
  players: PlayerInterface[];
}

export interface RoomMessage {
  roomId: string;
}

export interface RoomPlayerChatMessage extends RoomMessage {
  message: string;
}

export interface RoomPlayerChatDispatchMessage extends Pick<RoomPlayerChatMessage, 'message'> {
  player: PlayerInterface;
}

export interface RoomSendResult extends RoomMessage {
  result: GameFieldsInterface;
}

export type RoomStartMessage = RoomMessage;
export type RoomJoinMessage = RoomMessage;
