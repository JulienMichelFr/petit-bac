import { Injectable, PipeTransform } from '@nestjs/common';
import { PlayerInterface } from '@petit-bac/api-interfaces';
import { Socket } from 'socket.io';

@Injectable()
export class PlayerPipe implements PipeTransform {
  transform(value: Socket): PlayerInterface {
    return value.data as PlayerInterface;
  }
}
