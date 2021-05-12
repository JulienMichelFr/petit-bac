import { createReducer, on } from '@ngrx/store';
import { setProfile } from '../actions/profile.actions';
import { PlayerInterface } from '@petit-bac/api-interfaces';

export const initialState: Partial<PlayerInterface> = {};

export const profileReducer = createReducer(
  initialState,
  on(setProfile, (state, { profile }) => {
    return profile;
  })
);
