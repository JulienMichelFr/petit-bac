import { GameFieldsInterface, GameRound, PlayerInterface, RoomState } from '@petit-bac/api-interfaces';

export interface RoomUpdatePlayersMessage {
  players: PlayerInterface[];
}

export interface RoomMessage {
  roomId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RoomJoinMessage extends RoomMessage {}

export interface RoomPlayerChatMessage extends RoomMessage {
  message: string;
}

export interface RoomPlayerChatDispatchMessage extends Pick<RoomPlayerChatMessage, 'message'> {
  player: PlayerInterface;
}

export interface RoomUpdateMessage extends RoomMessage {
  state: RoomState;
  data?: GameRound[] | string;
}

export interface RoomSendResult extends RoomMessage {
  result: GameFieldsInterface;
  letter: string;
}
