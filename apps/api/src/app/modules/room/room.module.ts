import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService],
})
export class RoomModule {}
