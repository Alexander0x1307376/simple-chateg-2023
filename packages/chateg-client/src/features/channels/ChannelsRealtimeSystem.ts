import { Socket } from "socket.io-client";
import { ServerToClientEvents } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { ChannelsService } from "./ChannelsService";

type ChannelEvents = Pick<
  ServerToClientEvents,
  "channelUpdated" | "channelCreated" | "channelRemoved"
>;

export class ChannelsRealtimeSystem extends BaseWebSocketHandler {
  constructor(private channelsService: ChannelsService) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<ChannelEvents>(socket, {
      channelCreated: (channel) => {
        this.channelsService.upsertChannel(channel);
      },
      channelUpdated: (channel) => {
        this.channelsService.upsertChannel(channel);
      },
      channelRemoved: (channel) => {
        this.channelsService.removeChannel(channel.id);
      },
    });
  }
}
