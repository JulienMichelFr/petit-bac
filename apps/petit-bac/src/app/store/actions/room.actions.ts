import { createAction, props } from '@ngrx/store';
import { RoomInterface } from '@petit-bac/api-interfaces';

export const getRoom = createAction('[Room] Get');
export const getRoomSuccess = createAction('[Room] Get success', props<{ room: RoomInterface }>());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoomFail = createAction('[Room] Get fail', props<{ error: any }>());

export const updateRoom = createAction('[Room] Update', props<{ room: RoomInterface }>());
