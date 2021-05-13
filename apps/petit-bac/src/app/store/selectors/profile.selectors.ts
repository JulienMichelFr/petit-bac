import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { PlayerInterface } from '@petit-bac/api-interfaces';

export const selectProfile = createFeatureSelector<
  AppStateInterface,
  PlayerInterface
>('profile');

export const hasProfile = createSelector(
  selectProfile,
  (profile) => !!profile?.username
);
