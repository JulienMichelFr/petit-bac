import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PlayerInterface, RoomInterface, RoomStatus } from '@petit-bac/api-interfaces';
import { GAME_DURATION } from '../../../environments/environment';
import { RoomModel } from '../../models/room.model';

@Injectable()
export class RoomService {
  private rooms: Map<string, RoomModel> = new Map<string, RoomModel>();

  private static createRoomId(): string {
    return randomBytes(20).toString('hex').toUpperCase().substring(0, 5);
  }

  private static generateRandomLetter(): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  roomExist(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  getRoom(roomId: string): RoomModel {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    return room;
  }

  updateRoom(updateRoom: Partial<RoomInterface> & { id: string }): RoomModel {
    const room: RoomModel = this.getRoom(updateRoom.id);
    room.patch(updateRoom);
    this.rooms.set(room.id, room);
    return room;
  }

  removeRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  disconnectPlayer(player: PlayerInterface): RoomModel[] {
    const updatedRooms: RoomModel[] = [];
    for (const room of this.rooms.values()) {
      if (room.players.find((p) => p.username === player.username)) {
        room.players = room.players.filter((p) => p.username !== player.username);
        this.rooms.set(room.id, room);
        updatedRooms.push(room);
      }
    }
    return updatedRooms;
  }

  createRoom(): RoomModel {
    const room: RoomModel = new RoomModel(this, { id: RoomService.createRoomId() });
    this.rooms.set(room.id, room);
    return room;
  }

  startRoundForRoom(roomId: string): RoomModel {
    const room = this.getRoom(roomId);
    const letters: string[] = room.rounds.map(({ letter }) => letter);
    let newLetter: string = RoomService.generateRandomLetter();
    while (letters.includes(newLetter)) {
      newLetter = RoomService.generateRandomLetter();
    }

    room.rounds.push({
      letter: newLetter,
      results: [],
    });
    room.currentLetter = newLetter;
    room.status = RoomStatus.started;
    room.statusDuration = GAME_DURATION;

    return this.updateRoom(room);
  }
}
