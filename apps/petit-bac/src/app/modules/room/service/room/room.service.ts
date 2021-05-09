import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomInterface } from '@petit-bac/api-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RoomService {
  constructor(private http: HttpClient) {}

  createRoom(): Observable<RoomInterface> {
    return this.http.post<RoomInterface>('/api/rooms', {});
  }
}
