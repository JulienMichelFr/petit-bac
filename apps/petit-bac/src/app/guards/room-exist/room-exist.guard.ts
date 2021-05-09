import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { RoomService } from '../../modules/room/service/room/room.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RoomExistGuard implements CanActivate {
  constructor(private roomService: RoomService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.roomService.findRoom(route.paramMap.get('id')).pipe(
      map((value): boolean => !!value),
      catchError(
        (): Observable<UrlTree> => {
          return of(this.router.createUrlTree(['/']));
        }
      )
    );
  }
}
