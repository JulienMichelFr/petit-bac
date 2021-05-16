import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RoomPipe } from './room.pipe';

export const GetRoom = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return context.switchToWs().getData();
});

export const Room = (options?: unknown) => GetRoom(options, RoomPipe);
