import { Socket } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseEmitter } from "../webSockets/BaseEmitter";
import { ChannelsStore } from "./ChannelsStore";
import { Channel } from "../../types/entities";

export class ChannelsSocketEmitter extends BaseEmitter {
  constructor(
    protected socket: Socket<STC, CTS>,
    private channelsStore: ChannelsStore
  ) {
    super(socket);
  }

  createChannel(name: string) {
    return new Promise<Channel>((resolve, reject) => {
      this.socket.emit(
        "clientCreatesChannel",
        { name },
        ({ data, status, error }) => {
          if (status === "ok") {
            this.channelsStore.addChannel(data);
            resolve(data as Channel);
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
