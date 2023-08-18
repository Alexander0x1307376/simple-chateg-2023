import { Socket } from "socket.io-client";
import { BaseStore } from "../store/BaseStore";
import { ChannelsSocketEmitter } from "../channels/ChannelsSocketEmitter";

export type Emitters = {
  channelEmitter: ChannelsSocketEmitter;
};

export class SocketQuerySystem extends BaseStore<Emitters | undefined> {
  constructor() {
    super(undefined);
  }

  initEmitters(socket: Socket) {
    const emitters = {
      channelEmitter: new ChannelsSocketEmitter(socket),
    };

    this.set(emitters);
  }

  get emitters() {
    return this._store;
  }
}
