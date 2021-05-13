import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import { ChatComponent } from './containers/chat/chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from './services/chat/chat.service';

@NgModule({
  declarations: [ChatInputComponent, ChatMessagesComponent, ChatComponent],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [ChatService],
  exports: [ChatComponent],
})
export class ChatModule {}
