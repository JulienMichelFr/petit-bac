import { Controller, Get, Param, Post } from '@nestjs/common';
import { RoomInterface } from '@petit-bac/api-interfaces';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(): Promise<RoomInterface> {
    return this.roomService.createRoom();
  }

  @Get(':id')
  async findRoom(@Param('id') roomId: string): Promise<RoomInterface> {
    return this.roomService.getRoom(roomId);
  }
}
