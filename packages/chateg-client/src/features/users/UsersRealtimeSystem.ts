import { Socket } from "socket.io-client";
import { ServerToClientEvents as STC } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { UsersOnlineStore } from "./UsersOnlineStore";

type UsersEvents = Pick<STC, "userOnline" | "userOffline" | "syncState">;

export class UsersRealtimeSystem extends BaseWebSocketHandler {
  constructor(private usersStore: UsersOnlineStore) {
    super();
    this.init = this.init.bind(this);
  }

  init(socket: Socket) {
    this.bindHandlers<UsersEvents>(socket, {
      userOnline: (userData) => {
        this.usersStore.addUser(userData);
      },
      userOffline: ({ userId }) => {
        this.usersStore.removeUser(userId);
      },
      syncState: ({ usersOnline }) => {
        this.usersStore.setUsers(usersOnline);
      },
    });
  }
}
