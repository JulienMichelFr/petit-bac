import { createAction, props } from '@ngrx/store';
import { PlayerInterface } from '@petit-bac/api-interfaces';

export const setProfile = createAction(
  '[Profile] Set',
  props<{ profile: PlayerInterface }>()
);
