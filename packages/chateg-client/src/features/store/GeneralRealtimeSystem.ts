import { Socket } from "socket.io-client";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { GeneralStore } from "./GeneralStore";
import {
  // ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { UserTransfer } from "@simple-chateg-2023/server/src/features/users/userTypes";
import { ChannelTransfer } from "@simple-chateg-2023/server/src/features/channels/channelTypes";

type SocketEvents = STC;

export class GeneralRealtimeSystem extends BaseWebSocketHandler {
  constructor(private store: GeneralStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<SocketEvents>(socket, {
      syncState: ({ channels, usersOnline }) => {
        this.store.setState({ channels, users: usersOnline } as {
          users: UserTransfer[];
          channels: ChannelTransfer[];
        });
      },
      channelCreated: (channel) => {
        //
      },
      channelUpdated: (channel) => {
        //
      },
      channelRemoved: (channel) => {
        //
      },
      userOnline: (user) => {
        //
      },
      userUpdated: (user) => {
        //
      },
      userOffline: (user) => {
        //
      },
    });
  }
}
