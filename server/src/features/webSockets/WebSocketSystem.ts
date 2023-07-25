import { inject, injectable } from "inversify";
import { Express } from "express";
import { createServer } from "http";
import { Server as SocketServer, Socket, ServerOptions } from "socket.io";
import { ILogger } from "../logger/ILogger";
import { TYPES } from "../../injectableTypes";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "./webSocketEvents";
import { nanoid } from "nanoid";
import { ChannelsStore } from "./ChannelsStore";
import { UsersOnlineStore } from "./UsersOnlineStore";

@injectable()
export class WebSocketSystem {
  private socketServer: SocketServer<CTS, STC>;

  private channelsStore: ChannelsStore;
  private usersStore: UsersOnlineStore;

  constructor(
    app: Express,
    options: Partial<ServerOptions>,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    const wsServer = createServer(app);
    this.socketServer = new SocketServer(wsServer, options);
    this.addHandler = this.addHandler.bind(this);
    this.init = this.init.bind(this);

    this.usersStore = new UsersOnlineStore();
    this.channelsStore = new ChannelsStore();
  }

  init() {
    this.socketServer.on("connection", (socket: Socket<CTS, STC>) => {
      this.logger.log(`${socket.id} connected`);

      socket.on("clientCreatesChannel", (date) => {
        const channelRoom = "channel_" + nanoid();
        socket.join(channelRoom);
      });
      socket.on("clientJoinsChannel", (userId) => {
        //
      });
      socket.on("clientLeavesChannel", (userId) => {});
      socket.on("clientOnline", (userId) => {});
      socket.on("clientOffline", (userId) => {});

      socket.on("disconnect", (reason: any) => {
        this.logger.log(`${socket.id} disconnected`);
      });
    });
  }

  addHandler() {}
}
