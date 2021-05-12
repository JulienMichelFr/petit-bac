import { Module } from '@nestjs/common';
import { RoomModule } from './modules/room/room.module';
import { GeneralGateway } from './general/general.gateway';

@Module({
  imports: [RoomModule],
  controllers: [],
  providers: [GeneralGateway],
})
export class AppModule {}
