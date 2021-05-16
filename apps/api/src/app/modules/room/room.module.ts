import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { RoomPipe } from './room.pipe';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomGateway, RoomPipe],
  exports: [RoomService],
})
export class RoomModule {}
