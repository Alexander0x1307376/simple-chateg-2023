import { Socket } from "socket.io-client";

export abstract class BaseEmitter {
  constructor(protected socket: Socket) {}
}
