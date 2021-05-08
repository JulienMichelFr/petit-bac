import { createReducer, on } from '@ngrx/store';
import { setProfile } from '../actions/profile.actions';
import { UserInterface } from '@petit-bac/api-interfaces';

export interface ProfileState {
  user?: UserInterface;
}

export const initialState: ProfileState = {};

export const profileReducer = createReducer(
  initialState,
  on(setProfile, (state, action) => {
    return {
      ...state,
      user: action.user,
    };
  })
);
