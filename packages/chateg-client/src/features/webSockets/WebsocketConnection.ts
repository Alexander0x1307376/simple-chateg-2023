import { Socket, io } from "socket.io-client";
import { AuthData } from "../auth/AuthStore";
import { BaseStore } from "../store/BaseStore";

export class WebsocketConnection extends BaseStore<Socket | undefined> {
  constructor(private readonly hostUrl: string) {
    super(undefined);
  }

  connect(authData: AuthData) {
    console.log("[WebsocketSystem]: initialization");
    const extraHeaders = { Authorization: `Bearer ${authData.accessToken}` };
    const socket = io({
      autoConnect: false,
      host: this.hostUrl,
      auth: authData.userData,
      extraHeaders,
    });
    socket.on("connect", () => {
      console.log("[WebsocketSystem]: socket connected");
    });

    socket.on("connect_error", (error: Error) => {
      if (error.message === "NOT_AUTHORIZED") {
        console.log("NOT_AUTHORIZED");
      }
    });

    socket.connect();

    this.set(socket);
  }
}
