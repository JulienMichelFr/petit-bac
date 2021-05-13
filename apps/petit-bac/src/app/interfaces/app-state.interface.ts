import { PlayerInterface } from '@petit-bac/api-interfaces';
import { RouterState } from '@ngrx/router-store';

export interface AppStateInterface {
  profile?: PlayerInterface;
  router?: RouterState;
}
