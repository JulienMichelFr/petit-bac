import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './containers/game/game.component';
import { MatButtonModule } from '@angular/material/button';
import { GameInputsComponent } from './components/game-inputs/game-inputs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [GameComponent, GameInputsComponent],
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  exports: [GameComponent],
})
export class GameModule {}
