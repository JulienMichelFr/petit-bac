import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RoomInterface } from '@petit-bac/api-interfaces';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(): Promise<RoomInterface> {
    const roomId = this.roomService.createRoom();

    return {
      id: roomId,
    };
  }

  @Get(':id')
  async findRoom(@Param('id') roomId: string): Promise<RoomInterface> {
    const roomExist = this.roomService.roomExist(roomId);
    if (!roomExist) {
      throw new NotFoundException();
    }
    return {
      id: roomId,
    };
  }
}
