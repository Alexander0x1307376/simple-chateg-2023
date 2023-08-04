import { UsersRealtimeSystem } from "./features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "./features/channels/ChannelsRealtimeSystem";
import { Socket } from "socket.io-client";

export class RealtimeService {
  constructor(
    private usersRealtimeSystem: UsersRealtimeSystem,

    private channelsRealtimeSystem: ChannelsRealtimeSystem
  ) {}

  bindSocket(socket: Socket) {
    this.usersRealtimeSystem.init(socket);
    this.channelsRealtimeSystem.init(socket);
  }
}
