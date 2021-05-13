import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PlayerInterface, RoomInterface } from '@petit-bac/api-interfaces';

@Injectable()
export class RoomService {
  private rooms: Map<string, RoomInterface> = new Map<string, RoomInterface>();

  private static createRoomId(): string {
    return randomBytes(20).toString('hex').toUpperCase().substring(0, 5);
  }

  roomExist(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  getRoom(roomId: string): RoomInterface {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  createRoom(): string {
    const roomId = RoomService.createRoomId();
    this.rooms.set(roomId, { players: [], id: roomId });
    return roomId;
  }

  updateRoom(updateRoom: Partial<RoomInterface> & { id: string }): RoomInterface {
    const room: RoomInterface = {
      ...this.getRoom(updateRoom.id),
      ...updateRoom,
    };
    this.rooms.set(room.id, room);
    return room;
  }

  removeRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  disconnectPlayer(player: PlayerInterface): RoomInterface[] {
    const updatedRooms: RoomInterface[] = [];
    for (const room of this.rooms.values()) {
      if (room.players.find((p) => p.username === player.username)) {
        room.players = room.players.filter((p) => p.username !== player.username);
        this.rooms.set(room.id, room);
        updatedRooms.push(room);
      }
    }
    return updatedRooms;
  }
}
