import { UsersRealtimeSystem } from "./features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "./features/channels/ChannelsRealtimeSystem";
import { Socket } from "socket.io-client";
import { GeneralRealtimeSystem } from "./features/store/GeneralRealtimeSystem";

export class RealtimeService {
  constructor(
    private generalRealtimeSystem: GeneralRealtimeSystem,
    private usersRealtimeSystem: UsersRealtimeSystem,
    private channelsRealtimeSystem: ChannelsRealtimeSystem
  ) {}

  bindSocket(socket: Socket) {
    this.generalRealtimeSystem.init(socket);
    this.usersRealtimeSystem.init(socket);
    this.channelsRealtimeSystem.init(socket);
  }
}
