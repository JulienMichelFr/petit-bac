/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoomInterface } from '@petit-bac/api-interfaces';
import { createReducer, on } from '@ngrx/store';
import { getRoom, getRoomFail, getRoomSuccess, updateRoom } from '../actions/room.actions';

export interface RoomState {
  loading: boolean;
  error: any;
  room: RoomInterface;
}

export const initialState: RoomState = {
  loading: false,
  error: null,
  room: null,
};

export const roomReducer = createReducer(
  initialState,
  on(getRoom, (state) => ({
    ...state,
    loading: true,
  })),
  on(getRoomSuccess, updateRoom, (state, { room }) => ({
    ...state,
    loading: false,
    room,
  })),
  on(getRoomFail, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
