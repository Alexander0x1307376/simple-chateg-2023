import { Socket } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import { UsersOnlineStore } from "./UsersOnlineStore";

type UsersEvents = Pick<STC, "userOnline" | "userOffline" | "syncState">;

export class UsersRealtimeSystem extends BaseWebSocketHandler {
  constructor(
    protected socket: Socket<STC, CTS>,
    private usersStore: UsersOnlineStore
  ) {
    super(socket);
    this.init = this.init.bind(this);
  }

  init() {
    this.bindHandlers<UsersEvents>({
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
