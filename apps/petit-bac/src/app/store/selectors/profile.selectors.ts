import { createFeatureSelector } from '@ngrx/store';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { ProfileState } from '../reducers/profile.reducer';

export const selectProfile = createFeatureSelector<
  AppStateInterface,
  ProfileState
>('profile');
