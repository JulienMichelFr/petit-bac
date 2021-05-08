import { Module } from '@nestjs/common';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
