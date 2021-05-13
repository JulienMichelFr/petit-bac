import { Component } from '@angular/core';
import { RoomPlayerChatDispatchMessage } from '@petit-bac/ws-shared';
import { PlayerChatForm } from '../../components/chat-input/chat-input.component';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'petit-bac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messages$: Observable<RoomPlayerChatDispatchMessage[]> = this.chatService.messages$;

  constructor(private chatService: ChatService) {}

  sendAction(messageForm: PlayerChatForm): void {
    this.chatService.sendMessage(messageForm).subscribe();
  }
}
