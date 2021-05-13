import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RoomPlayerChatDispatchMessage } from '@petit-bac/ws-shared';

@Component({
  selector: 'petit-bac-chat-messages',
  templateUrl: './chat--messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent {
  @Input() messages: RoomPlayerChatDispatchMessage[] = [];
}
