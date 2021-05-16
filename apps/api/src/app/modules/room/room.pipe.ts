import { Injectable, PipeTransform } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomModel } from '../../models/room.model';

@Injectable()
export class RoomPipe implements PipeTransform {
  constructor(private roomService: RoomService) {}

  async transform({ roomId }: { roomId: string }): Promise<RoomModel> {
    return this.roomService.getRoom(roomId);
  }
}
