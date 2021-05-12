import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { selectProfile } from '../../store/selectors/profile.selectors';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PlayerInterface } from '@petit-bac/api-interfaces';

@Injectable()
export class HasProfileGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppStateInterface>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(selectProfile).pipe(
      take(1),
      map((profile: PlayerInterface) => {
        if (profile?.username) {
          return true;
        }
        const url = '/' + route.url.join('/') + '/invite';
        return this.router.createUrlTree([url]);
      })
    );
  }
}
