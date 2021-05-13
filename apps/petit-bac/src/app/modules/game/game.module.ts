import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './containers/game/game.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [GameComponent],
})
export class GameModule {}
