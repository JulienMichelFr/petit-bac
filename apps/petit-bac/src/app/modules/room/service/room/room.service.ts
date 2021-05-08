import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomInterface } from '../../../../../../../../libs/api-interfaces/src/lib/room.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RoomService {
  constructor(private http: HttpClient) {}

  createRoom(): Observable<RoomInterface> {
    return this.http.post<RoomInterface>('/api/rooms', {});
  }
}
