import { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer, Socket, ServerOptions } from "socket.io";
import { ILogger } from "../logger/ILogger";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "./webSocketEvents";
import { UsersOnlineStore } from "./UsersOnlineStore";
import { AuthService } from "../auth/AuthService";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader";
import { NOT_AUTHORIZED } from "./webSocketErrorMessages";
import { UsersService } from "../users/UsersService";
import { UserDto } from "../users/dto/user.dto";
import { ChannelsStore } from "../channels/ChannelsStore";
import { ChannelsRealtimeSystem } from "../channels/ChannelsRealtimeSystem";
import { UsersRealtimeSystem } from "../users/UsersRealtimeSystem";

export class WebSocketSystem {
  private _socketServer: SocketServer<CTS, STC>;
  private _channelsStore: ChannelsStore;
  private _usersStore: UsersOnlineStore;
  private _wsServer: HttpServer;
  private _channelsRealtimeSystem: ChannelsRealtimeSystem;
  private _usersRealtimeSystem: UsersRealtimeSystem;

  get wsServer() {
    return this._wsServer;
  }

  constructor(
    app: Express,
    options: Partial<ServerOptions>,
    private authService: AuthService,
    private usersSerivce: UsersService,
    private logger: ILogger
  ) {
    this._wsServer = createServer(app);

    this._socketServer = new SocketServer(this._wsServer, options);
    this.init = this.init.bind(this);

    this._socketServer.use((socket, next) => {
      const authHeader = socket.handshake.headers.authorization;
      const auth = socket.handshake.auth;

      const accessToken = getTokenFromHeader(authHeader);
      const payload = this.authService.validateToken(accessToken, "access");
      if (!payload || !auth.id) {
        this.logger.error(
          "[WebSocketSystem]: Сокет-соединение не авторизовано"
        );
        next(new Error(NOT_AUTHORIZED));
        return;
      }
      return next();
    });

    this._usersStore = new UsersOnlineStore();
    this._channelsStore = new ChannelsStore();

    this._usersRealtimeSystem = new UsersRealtimeSystem(
      this._socketServer,
      this._usersStore,
      this.logger
    );
    this._channelsRealtimeSystem = new ChannelsRealtimeSystem(
      this._socketServer,
      this._channelsStore
    );
  }

  init() {
    this._socketServer.on("connection", async (socket: Socket<CTS, STC>) => {
      const user = (await this.usersSerivce.getUserById(
        socket.handshake.auth.id
      )) as UserDto;

      this._usersRealtimeSystem.handleConnection(socket, user);
      this._channelsRealtimeSystem.handleConnection(socket, user);

      socket.emit("syncState", {
        usersOnline: this._usersStore.getArray(),
      });
    });
  }
}
