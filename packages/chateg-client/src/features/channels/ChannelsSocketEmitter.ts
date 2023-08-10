import { Socket } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseEmitter } from "../webSockets/BaseEmitter";
import { GeneralStore } from "../store/GeneralStore";
import { ChannelTransfer } from "@simple-chateg-2023/server/src/features/channels/channelTypes";

// Связан с ChannelsRealtimeSystem на сервере

export class ChannelsSocketEmitter extends BaseEmitter {
  constructor(
    protected socket: Socket<STC, CTS>,
    private store: GeneralStore,
  ) {
    super(socket);
  }

  createChannel(name: string) {
    return new Promise<ChannelTransfer>((resolve, reject) => {
      this.socket.emit("clientCreatesChannel", { name }, ({ data, status, error }) => {
        if (status === "ok" && data) {
          this.store.upsertChannel(data);
          resolve(data);
        } else if (status === "error" && error) {
          reject(error);
        } else reject("????");
      });
    });
  }

  joinChannel(channelId: string) {
    return new Promise<ChannelTransfer>((resolve, reject) => {
      this.socket.emit("clientJoinsChannel", channelId, ({ data, status, error }) => {
        if (status === "ok" && data) {
          this.store.upsertChannel(data);
          resolve(data);
        } else if (status === "error" && error) {
          reject(error);
        }
      });
    });
  }

  leaveChannel(channelId: string) {
    this.socket.emit("clientLeavesChannel", channelId);
  }
}
