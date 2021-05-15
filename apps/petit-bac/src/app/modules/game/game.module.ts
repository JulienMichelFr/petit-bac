import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './containers/game/game.component';
import { MatButtonModule } from '@angular/material/button';
import { GameInputsComponent } from './components/game-inputs/game-inputs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GameStatePipe } from './pipes/game-state/game-state.pipe';
import { GameRoundResultComponent } from './components/game-round-result/game-round-result.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [GameComponent, GameInputsComponent, GameStatePipe, GameRoundResultComponent],
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatTableModule],
  exports: [GameComponent, GameStatePipe],
})
export class GameModule {}
