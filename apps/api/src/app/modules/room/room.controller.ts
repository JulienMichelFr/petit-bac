import { Controller, Post } from '@nestjs/common';
import { RoomInterface } from '@petit-bac/api-interfaces';
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
