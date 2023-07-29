import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { AuthStore } from "../auth/AuthStore";
import { UsersOnlineStore } from "../users/UsersOnlineStore";
import { User } from "../../types/entities";

export class WebsocketSystem {
  private _socket: Socket<STC, CTS> | undefined;
  get socket() {
    return this._socket;
  }
  get isConnected() {
    return this._socket ? this._socket.connected : false;
  }

  constructor(
    private readonly hostUrl: string,
    private authStore: AuthStore,
    private usersOnlineStore: UsersOnlineStore
  ) {}

  connect() {
    console.log("[WebsocketSystem]: connecting...");
    if (this._socket) {
      this._socket.connect();
      console.log("[WebsocketSystem]: socket connected");
    } else {
      console.warn(
        "[WebsocketSystem]: The socket hasn't been initialized. Connection won't be established"
      );
    }
  }

  init() {
    console.log("[WebsocketSystem]: initialization");
    const authData = this.authStore.authData;
    const extraHeaders = authData
      ? { Authorization: `Bearer ${authData.accessToken}` }
      : undefined;

    this._socket = io({
      autoConnect: false,
      host: this.hostUrl,
      auth: this.authStore.authData?.userData,
      extraHeaders,
    });

    this._socket.on("connect", () => {
      console.log("[WebsocketSystem]: socket connected");
    });
    this._socket.on("syncState", ({ usersOnline }) => {
      this.usersOnlineStore.set(usersOnline as User[]);
    });

    this._socket.on("connect_error", (error: Error) => {
      if (error.message === "NOT_AUTHORIZED") {
        console.log("NOT_AUTHORIZED");
      }
    });

    this._socket.on("userOnline", (user) => {
      this.usersOnlineStore.update((prev) => {
        const result = [user, ...prev];
        return result;
      });
    });

    this._socket.on("userOffline", ({ userId }) => {
      this.usersOnlineStore.update((prev) => {
        return prev.filter((item) => item.id !== userId);
      });
    });
  }
}
