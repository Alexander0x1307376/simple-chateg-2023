import { Socket } from "socket.io-client";
import { BaseStore } from "../store/BaseStore";
import { ChannelsSocketEmitter } from "../channels/ChannelsSocketEmitter";
import { ChannelsStore } from "../channels/ChannelsStore";

export class SocketQuerySystem extends BaseStore {
  constructor(private channelsStore: ChannelsStore) {
    super(undefined);
  }

  initEmitters(socket: Socket) {
    const emitters = {
      channelEmitter: new ChannelsSocketEmitter(socket, this.channelsStore),
    };

    this.set(emitters);
  }
}
