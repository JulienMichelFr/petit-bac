import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { GameFieldsInterface } from '@petit-bac/api-interfaces';

@Component({
  selector: 'petit-bac-game-inputs',
  templateUrl: './game-inputs.component.html',
  styleUrls: ['./game-inputs.component.scss'],
})
export class GameInputsComponent {
  @Input()
  letter: string;

  @Output() sendResult: EventEmitter<GameFieldsInterface> = new EventEmitter<GameFieldsInterface>();

  form: FormGroup<GameFieldsInterface> = new FormGroup<GameFieldsInterface>({
    animal: new FormControl<string>(''),
    movieOrTvShow: new FormControl<string>(''),
    cityOrCountry: new FormControl<string>(''),
    fruitOrVegetable: new FormControl<string>(''),
    girlName: new FormControl<string>(''),
    job: new FormControl<string>(''),
  });

  submit() {
    this.sendResult.emit(this.form.value);
  }
}
