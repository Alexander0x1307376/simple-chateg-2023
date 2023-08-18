import { Socket } from "socket.io-client";
import { BaseWebSocketHandler } from "./features/webSockets/BaseWebSocketHandler";

export class RealtimeService {
  constructor(private handlers: BaseWebSocketHandler[]) {}

  bindSocket(socket: Socket) {
    this.handlers.forEach((handler: BaseWebSocketHandler) => {
      handler.init(socket);
    });
  }
}
