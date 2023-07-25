import { Server, Socket } from "socket.io";
import { BaseRealtimeSystem } from "../common/BaseRealtimeSystem";

export class UsersOnlineSystem extends BaseRealtimeSystem {
  constructor(protected socketServer: Server) {
    super(socketServer);
  }

  handler(socket: Socket) {}

  init(): void {}
}
