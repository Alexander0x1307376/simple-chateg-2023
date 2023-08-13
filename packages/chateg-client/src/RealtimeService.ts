import { UsersRealtimeSystem } from "./features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "./features/channels/ChannelsRealtimeSystem";
import { Socket } from "socket.io-client";
import { SynchronizationRealtimeSystem } from "./features/webSockets/SynchronizationRealtimeSystem";

export class RealtimeService {
  constructor(
    private usersRealtimeSystem: UsersRealtimeSystem,
    private channelsRealtimeSystem: ChannelsRealtimeSystem,
    private syncRealtimeSystem: SynchronizationRealtimeSystem,
  ) {}

  bindSocket(socket: Socket) {
    this.syncRealtimeSystem.init(socket);
    this.usersRealtimeSystem.init(socket);
    this.channelsRealtimeSystem.init(socket);
  }
}
