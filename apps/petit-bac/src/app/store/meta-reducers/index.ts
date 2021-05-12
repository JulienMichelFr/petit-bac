/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['profile'] })(reducer);
}
export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
