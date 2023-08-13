import { Socket } from "socket.io-client";
import { ServerToClientEvents as STC } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { GeneralStore } from "../store/GeneralStore";

type UsersEvents = Pick<STC, "userOnline" | "userUpdated" | "userOffline">;

export class UsersRealtimeSystem extends BaseWebSocketHandler {
  constructor(private store: GeneralStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<UsersEvents>(socket, {
      userOnline: (userData) => {
        console.log(`[UsersRealtimeSystem]:userOnline: ${userData.name}`);
        this.store.upsertUser(userData);
      },
      userUpdated: (userData) => {
        console.log(`[UsersRealtimeSystem]:userUpdated: ${userData.name}`);
        this.store.upsertUser(userData);
      },
      userOffline: (userData) => {
        console.log(`[UsersRealtimeSystem]:userOffline: ${userData.name}`);
        this.store.removeUser(userData.id);
      },
    });
  }
}
