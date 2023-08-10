import { Socket } from "socket.io-client";
import { ServerToClientEvents as STC } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { GeneralStore } from "../store/GeneralStore";
import { User } from "../../types/entities";

type UsersEvents = Pick<STC, "userOnline" | "userOffline">;

export class UsersRealtimeSystem extends BaseWebSocketHandler {
  constructor(private store: GeneralStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<UsersEvents>(socket, {
      userOnline: (userData) => {
        this.store.upsertUser(userData as User);
      },
      userOffline: ({ userId }) => {
        this.store.removeUser(userId);
      },
    });
  }
}
