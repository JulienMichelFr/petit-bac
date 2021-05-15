import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { RoomState } from '../reducers/room.reducer';

export const selectRoomState = createFeatureSelector<AppStateInterface, RoomState>('room');
export const selectRoom = createSelector(selectRoomState, (state) => state.room);
export const selectRoomPlayers = createSelector(selectRoom, (room) => {
  return room?.players ?? [];
});

export const selectRoomStatus = createSelector(selectRoom, (room) => {
  return room?.state ?? null;
});

export const selectRoomCurrentLetter = createSelector(selectRoom, (room) => {
  return room?.currentLetter ?? null;
});

export const selectRoomRounds = createSelector(selectRoom, (room) => {
  return room?.rounds ?? [];
});

export const selectRoomStatusDuration = createSelector(selectRoom, (room) => {
  return room?.statusDuration ?? 0;
});
