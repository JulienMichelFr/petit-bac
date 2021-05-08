import { Controller, Post } from '@nestjs/common';
import { RoomInterface } from '../../../../../../libs/api-interfaces/src/lib/room.interface';
import { randomBytes } from 'crypto';

@Controller('rooms')
export class RoomController {
  @Post()
  async createRoom(): Promise<RoomInterface> {
    return {
      id: randomBytes(20).toString('hex'),
    };
  }
}
