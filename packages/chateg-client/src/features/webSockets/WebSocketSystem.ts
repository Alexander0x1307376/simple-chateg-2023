import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";

export class WebsocketSystem {
  socket: Socket<CTS, STC>;

  constructor(url: string) {
    this.socket = io(url);
  }
}
