import { createAction, props } from '@ngrx/store';
import { UserInterface } from '@petit-bac/api-interfaces';

export const setProfile = createAction(
  '[Profile] Set',
  props<{ user: UserInterface }>()
);
