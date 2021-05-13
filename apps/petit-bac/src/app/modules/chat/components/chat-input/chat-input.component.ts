import { Component, EventEmitter, Output } from '@angular/core';
import { RoomPlayerChatMessage } from '@petit-bac/ws-shared';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';

export type PlayerChatForm = Pick<RoomPlayerChatMessage, 'message'>;
@Component({
  selector: 'petit-bac-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
  form = new FormGroup<PlayerChatForm>({
    message: new FormControl('', [Validators.required]),
  });

  @Output()
  sendAction: EventEmitter<PlayerChatForm> = new EventEmitter<PlayerChatForm>();

  public submit(): void {
    this.sendAction.emit(this.form.value);
    this.form.reset();
  }
}
