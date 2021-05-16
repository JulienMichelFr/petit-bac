import { createWsParamDecorator } from '@nestjs/websockets/utils';
import { WsParamtype } from '@nestjs/websockets/enums/ws-paramtype.enum';
import { PlayerPipe } from './player.pipe';

export const GetPlayer = createWsParamDecorator(WsParamtype.SOCKET);

export const Player = () => GetPlayer(PlayerPipe);
