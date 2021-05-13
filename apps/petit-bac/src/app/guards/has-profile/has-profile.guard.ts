import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AppStateInterface } from '../../interfaces/app-state.interface';
import { Store } from '@ngrx/store';
import { hasProfile } from '../../store/selectors/profile.selectors';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class HasProfileGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AppStateInterface>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(hasProfile).pipe(
      take(1),
      map((hasProfile: boolean) => {
        if (hasProfile) {
          return true;
        }
        const url = '/' + route.url.join('/') + '/invite';
        return this.router.createUrlTree([url]);
      })
    );
  }
}
