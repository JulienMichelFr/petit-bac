import { GameRound, PlayerInterface, PlayerResult, RoomInterface, RoomStatus } from '@petit-bac/api-interfaces';
import { RoomService } from '../modules/room/room.service';
import { GAME_DURATION, GAME_START_DELAY } from '../../environments/environment';
import { concat, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class RoomModel implements RoomInterface {
  currentLetter: string = null;
  id: string = null;
  players: PlayerInterface[] = [];
  rounds: GameRound[] = [];
  status: RoomStatus = RoomStatus.LOBBY;
  statusDuration = 0;
  roundLeft = 4;

  constructor(private roomService: RoomService, data?: Partial<RoomInterface>) {
    if (data) {
      this.patch(data);
    }
  }

  patch(data: Partial<RoomInterface>) {
    const keys = ['statusDuration', 'currentLetter', 'id', 'players', 'rounds', 'status', 'roundLeft'];
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
      roundLeft: this.roundLeft,
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

  private static delay(duration: number): Observable<undefined> {
    return of(undefined).pipe(delay(duration + 1000));
  }

  runGame(): Observable<RoomModel> {
    this.startGame();
    return concat(
      of<RoomModel>(this),
      RoomModel.delay(GAME_START_DELAY).pipe(
        map<number, RoomModel>(() => {
          this.startRound();
          return this;
        })
      ),
      RoomModel.delay(GAME_DURATION).pipe(
        map<number, RoomModel>(() => {
          this.endRound();
          return this;
        })
      )
    );
  }

  startGame(): void {
    if (![RoomStatus.LOBBY, RoomStatus.END_ROUND].includes(this.status) || this.roundLeft <= 0) {
      return;
    }
    this.status = RoomStatus.STARTING;
    this.statusDuration = GAME_START_DELAY;
    this.save();
  }

  startRound(): void {
    if (this.status !== RoomStatus.STARTING) {
      return;
    }
    const letters: string[] = this.rounds.map(({ letter }) => letter);
    let newLetter: string = RoomModel.generateRandomLetter();
    while (letters.includes(newLetter)) {
      newLetter = RoomModel.generateRandomLetter();
    }

    this.rounds.push({
      letter: newLetter,
      results: [],
    });
    this.currentLetter = newLetter;
    this.status = RoomStatus.IN_ROUND;
    this.statusDuration = GAME_DURATION;
    this.save();
  }

  endRound(): void {
    if (this.status !== RoomStatus.IN_ROUND) {
      return;
    }
    this.status = RoomStatus.END_ROUND;
    this.statusDuration = 0;
    this.roundLeft -= 1;
    if (this.roundLeft <= 0) {
      this.status = RoomStatus.END_GAME;
    }
    this.save();
  }

  private static generateRandomLetter(): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  addPlayer(player: PlayerInterface) {
    const players = this.players.map(({ username }) => username);
    if (!players.includes(player.username)) {
      this.players.push(player);
      this.save();
    }
  }
}
