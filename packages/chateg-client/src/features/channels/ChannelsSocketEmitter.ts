import { Socket } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  Response,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseEmitter } from "../webSockets/BaseEmitter";
import { ChannelTransfer } from "@simple-chateg-2023/server/src/features/channels/channelTypes";
import { socketEmitWithAck } from "../utils/socketEmitAck";

// Связан с ChannelsRealtimeSystem на сервере

export class ChannelsSocketEmitter extends BaseEmitter {
  constructor(protected socket: Socket<STC, CTS>) {
    super(socket);
  }
  async createChannel(name: string): Promise<Response<ChannelTransfer>> {
    const response = await socketEmitWithAck<{ name: string }, ChannelTransfer>(
      this.socket,
      "clientCreatesChannel",
      { name },
    );
    console.log(`[ChannelsSocketEmitter]:createChannel: status: ${response.status}`);
    return response;
  }

  async joinChannel(channelId: string): Promise<Response<ChannelTransfer>> {
    const response = await socketEmitWithAck<string, ChannelTransfer>(
      this.socket,
      "clientJoinsChannel",
      channelId,
    );
    console.log(`[ChannelsSocketEmitter]:joinChannel: status: ${response.status}`);
    return response;
  }

  leaveChannel(channelId: string): void {
    this.socket.emit("clientLeavesChannel", channelId);
  }
}
