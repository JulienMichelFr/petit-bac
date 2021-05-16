import { Module } from '@nestjs/common';
import { RoomModule } from './modules/room/room.module';
import { GeneralGateway } from './general/general.gateway';
import { PlayerPipe } from './general/player.pipe';

@Module({
  imports: [RoomModule],
  controllers: [],
  providers: [GeneralGateway, PlayerPipe],
})
export class AppModule {}
