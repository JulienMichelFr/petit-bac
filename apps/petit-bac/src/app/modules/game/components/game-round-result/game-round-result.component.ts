import { Component, Input } from '@angular/core';
import { GameRound } from '@petit-bac/api-interfaces';

@Component({
  selector: 'petit-bac-game-round-result',
  templateUrl: './game-round-result.component.html',
  styleUrls: ['./game-round-result.component.scss'],
})
export class GameRoundResultComponent {
  @Input() roundResult: GameRound;

  readonly columns: string[] = ['player', 'fruitOrVegetable', 'cityOrCountry', 'job', 'animal', 'girlName', 'movieOrTvShow'];
}
