import { Socket } from "socket.io-client";
import {
  // ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { ChannelsStore } from "./ChannelsStore";
import { ChannelDto } from "@simple-chateg-2023/server/src/features/channels/ChannelDto";

type ChannelEvents = Pick<
  STC,
  "channelUpdated" | "channelCreated" | "channelRemoved"
>;

export class ChannelsRealtimeSystem extends BaseWebSocketHandler {
  constructor(private channelsStore: ChannelsStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<ChannelEvents>(socket, {
      channelCreated: (channel: ChannelDto) => {
        console.log("CHANNEL_CREATED");
        this.channelsStore.addChannel(channel);
      },
      channelUpdated: (channel: ChannelDto) => {
        console.log("CHANNEL_UPDATED");
        this.channelsStore.updateChannel(channel);
      },
      channelRemoved: (channelId: string) => {
        this.channelsStore.removeChannel(channelId);
      },
    });
  }
}
