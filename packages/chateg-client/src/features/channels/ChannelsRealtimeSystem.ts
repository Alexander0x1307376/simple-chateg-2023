import { Socket } from "socket.io-client";
import { ServerToClientEvents } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { GeneralStore } from "../store/GeneralStore";

type ChannelEvents = Pick<
  ServerToClientEvents,
  "channelUpdated" | "channelCreated" | "channelRemoved"
>;

export class ChannelsRealtimeSystem extends BaseWebSocketHandler {
  constructor(private store: GeneralStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<ChannelEvents>(socket, {
      channelCreated: (channel) => {
        this.store.upsertChannel(channel);
      },
      channelUpdated: (channel) => {
        this.store.upsertChannel(channel);
      },
      channelRemoved: (channel) => {
        this.store.removeChannel(channel.id);
      },
    });
  }
}
