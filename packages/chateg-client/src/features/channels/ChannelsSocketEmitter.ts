import { Socket } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseEmitter } from "../webSockets/BaseEmitter";
import { ChannelsStore } from "./ChannelsStore";
import { ChannelDto } from "@simple-chateg-2023/server/src/features/channels/ChannelDto";

export class ChannelsSocketEmitter extends BaseEmitter {
  constructor(
    protected socket: Socket<STC, CTS>,
    private channelsStore: ChannelsStore
  ) {
    super(socket);
  }

  createChannel(name: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        "clientCreatesChannel",
        { name },
        ({ data, status, error }) => {
          if (status === "ok") {
            this.channelsStore.addChannel(data as ChannelDto);
            resolve(data);
            return;
          } else if (status === "error" && error) {
            reject(error);
            return;
          }
        }
      );
    });
  }

  joinChannel(channelId: string) {
    this.socket.emit("clientJoinsChannel", channelId);
  }

  leaveChannel(channelId: string) {
    this.socket.emit("clientLeavesChannel", channelId);
  }
}
