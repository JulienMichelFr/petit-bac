import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomService {
  #rooms: Set<string> = new Set<string>();

  private static createRoomId(): string {
    return randomBytes(20).toString('hex');
  }

  roomExist(roomId: string): boolean {
    return this.#rooms.has(roomId);
  }

  createRoom(): string {
    const roomId = RoomService.createRoomId();
    this.#rooms.add(roomId);
    return roomId;
  }

  removeRoom(roomId: string): boolean {
    return this.#rooms.delete(roomId);
  }
}
