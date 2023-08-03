import { UsersOnlineStore } from "./features/users/UsersOnlineStore";
import { ChannelsStore } from "./features/channels/ChannelsStore";
import { UsersRealtimeSystem } from "./features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "./features/channels/ChannelsRealtimeSystem";
import { Socket } from "socket.io-client";

export class RealtimeService {
  constructor(
    private usersOnlineStore: UsersOnlineStore,
    private channelsStore: ChannelsStore
  ) {}

  bindSocket(socket: Socket) {
    const usersRealtimeSystem = new UsersRealtimeSystem(
      socket,
      this.usersOnlineStore
    );
    const channelsRealtimeSystem = new ChannelsRealtimeSystem(
      socket,
      this.channelsStore
    );

    usersRealtimeSystem.init();
    channelsRealtimeSystem.init();
  }
}
