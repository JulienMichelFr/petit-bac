import { GameRound, PlayerInterface, PlayerResult, RoomInterface, RoomStatus } from '@petit-bac/api-interfaces';
import { RoomService } from '../modules/room/room.service';

export class RoomModel implements RoomInterface {
  currentLetter: string = null;
  id: string = null;
  players: PlayerInterface[] = [];
  rounds: GameRound[] = [];
  status: RoomStatus = RoomStatus.lobby;
  statusDuration = 0;

  constructor(private roomService: RoomService, data?: Partial<RoomInterface>) {
    if (data) {
      this.patch(data);
    }
  }

  patch(data: Partial<RoomInterface>) {
    const keys = ['statusDuration', 'currentLetter', 'id', 'players', 'rounds', 'status'];
    for (const key of Object.keys(data)) {
      if (keys.includes(key)) {
        this[key] = data[key];
      }
    }
  }

  toJSON(): RoomInterface {
    return {
      currentLetter: this.currentLetter,
      id: this.id,
      players: this.players,
      rounds: this.rounds,
      status: this.status,
      statusDuration: this.statusDuration,
    };
  }

  save() {
    this.roomService.updateRoom(this);
  }

  addRound(round: PlayerResult): void {
    const found = this.rounds.find(({ letter }) => this.currentLetter === letter);
    const resultForPlayer = found.results.find(({ player }) => player.username === round.player.username);
    if (resultForPlayer) {
      resultForPlayer.result = round.result;
    } else {
      found.results.push({ player: round.player, result: round.result });
    }
    this.save();
  }

  addPlayer(player: PlayerInterface) {
    this.players.push(player);
    this.save();
  }
}
