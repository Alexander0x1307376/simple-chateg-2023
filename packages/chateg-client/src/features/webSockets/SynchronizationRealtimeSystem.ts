import { Socket } from "socket.io-client";
import { ServerToClientEvents as STC } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { GeneralStore } from "../store/GeneralStore";

type UsersEvents = Pick<STC, "syncState">;

export class SynchronizationRealtimeSystem extends BaseWebSocketHandler {
  constructor(private store: GeneralStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<UsersEvents>(socket, {
      syncState: ({ channels, usersOnline }) => {
        console.log(`[SynchronizationRealtimeSystem]:syncState`);
        this.store.setState({ channels, users: usersOnline });
      },
    });
  }
}
