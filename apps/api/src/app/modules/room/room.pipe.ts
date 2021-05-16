import { Injectable, PipeTransform } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomInterface } from '@petit-bac/api-interfaces';

@Injectable()
export class RoomPipe implements PipeTransform {
  constructor(private roomService: RoomService) {}

  async transform({ roomId }: { roomId: string }): Promise<RoomInterface> {
    return this.roomService.getRoom(roomId);
  }
}
