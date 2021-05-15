import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PlayerInterface, PlayerResultWithLetter, RoomInterface, RoomState } from '@petit-bac/api-interfaces';

@Injectable()
export class RoomService {
  private rooms: Map<string, RoomInterface> = new Map<string, RoomInterface>();

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

  getRoom(roomId: string): RoomInterface {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    return room;
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

  createRoom(): RoomInterface {
    const roomId = RoomService.createRoomId();
    const room: RoomInterface = { players: [], id: roomId, state: RoomState.lobby, rounds: [] };
    this.rooms.set(roomId, room);
    return room;
  }

  startRoundForRoom(roomId: string): RoomInterface {
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
    room.state = RoomState.started;

    return this.updateRoom(room);
  }

  addRoundForRoom(roomId: string, round: PlayerResultWithLetter): RoomInterface {
    const room = this.getRoom(roomId);
    const found = room.rounds.find(({ letter }) => round.letter === letter);
    const resultForPlayer = found.results.find(({ player }) => player.username === round.player.username);
    if (resultForPlayer) {
      resultForPlayer.result = round.result;
    } else {
      found.results.push({ player: round.player, result: round.result });
    }
    return this.updateRoom(room);
  }
}
