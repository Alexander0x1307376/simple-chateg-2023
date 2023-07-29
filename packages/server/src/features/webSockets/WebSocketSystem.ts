import { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer, Socket, ServerOptions } from "socket.io";
import { ILogger } from "../logger/ILogger";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "./webSocketEvents";
import { ChannelsStore } from "./ChannelsStore";
import { UsersOnlineStore } from "./UsersOnlineStore";
import { AuthService } from "../auth/AuthService";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader";
import { NOT_AUTHORIZED } from "./webSocketErrorMessages";
import { UsersService } from "../users/UsersService";
import { UserDto } from "../users/dto/user.dto";

export class WebSocketSystem {
  private socketServer: SocketServer<CTS, STC>;
  private channelsStore: ChannelsStore;
  private usersStore: UsersOnlineStore;
  private _wsServer: HttpServer;
  private userService: UsersService;
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

    this.socketServer = new SocketServer(this._wsServer, options);
    this.init = this.init.bind(this);

    this.socketServer.use((socket, next) => {
      const authHeader = socket.handshake.headers.authorization;
      const auth = socket.handshake.auth;

      const accessToken = getTokenFromHeader(authHeader);
      const payload = this.authService.validateToken(accessToken, "access");
      if (!payload || !auth.id) {
        this.logger.error("Сокет-соединение не авторизовано");
        next(new Error(NOT_AUTHORIZED));
        return;
      }
      return next();
    });

    this.usersStore = new UsersOnlineStore();
    this.channelsStore = new ChannelsStore();
  }

  init() {
    this.socketServer.on("connection", async (socket: Socket<CTS, STC>) => {
      this.logger.log(`${socket.id} connected`);

      console.log("[INIT]:", socket.handshake.auth);

      const user = (await this.usersSerivce.getUserById(
        socket.handshake.auth.id
      )) as UserDto;

      this.usersStore.addUser(user);

      socket.broadcast.emit("userOnline", user);
      socket.emit("syncState", {
        usersOnline: this.usersStore.getArray(),
      });

      socket.on("clientCreatesChannel", (date) => {
        const channelRoom = "channel_" + Date.now();
        socket.join(channelRoom);
      });
      socket.on("clientJoinsChannel", (userId) => {
        //
      });
      socket.on("clientLeavesChannel", (userId) => {
        //
      });

      socket.on("disconnect", (reason: any) => {
        this.logger.log(`${socket.id} disconnected`);
        this.usersStore.removeUser(user.id);
        this.socketServer.emit("userOffline", {
          userId: user.id,
          socketId: socket.id,
        });
      });
    });
  }
}
