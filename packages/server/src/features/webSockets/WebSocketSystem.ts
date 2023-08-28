import { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer, Socket, ServerOptions } from "socket.io";
import { ILogger } from "../logger/ILogger";
import { ClientToServerEvents as CTS, ServerToClientEvents as STC } from "./webSocketEvents";
import { AuthService } from "../auth/AuthService";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader";
import { NOT_AUTHORIZED } from "./webSocketErrorMessages";
import { UsersService } from "../users/UsersService";
import { UserTransfer } from "../users/userTypes";
import { UsersRealtimeState } from "../users/UsersRealtimeState";
import { ChannelsRealtimeState } from "../channels/ChannelsRealtimeState";
import { EventEmitter } from "../eventEmitter/EventEmitter";
import { UsersRealtimeStateBuilder } from "../users/UsersRealtimeStateBuilder";
import { ChannelsRealtimeStateBuilder } from "../channels/ChannelsRealtimeStateBuilder";
import { channelDataToTransfer, userDataToTransfer } from "./utils";
import { PeerData } from "../p2p/peerTypes";
import { PeerSocketHandler } from "../p2p/PeerSocketHandler";

export class WebSocketSystem {
  private _socketServer: SocketServer<CTS, STC>;
  private _wsServer: HttpServer;
  private _usersRealtimeState: UsersRealtimeState;
  private _channelsRealtimeState: ChannelsRealtimeState;
  get wsServer() {
    return this._wsServer;
  }

  constructor(
    app: Express,
    options: Partial<ServerOptions>,
    private authService: AuthService,
    private usersSerivce: UsersService,
    private logger: ILogger,
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
        this.logger.error("[WebSocketSystem]: Socket connection isn't authorized");
        next(new Error(NOT_AUTHORIZED));
        return;
      }
      return next();
    });

    const { usersRealtimeState } = UsersRealtimeStateBuilder.build();
    const { channelsRealtimeState } = ChannelsRealtimeStateBuilder.build(
      usersRealtimeState,
      3000, //TODO: перенести
      this.logger,
    );

    this._usersRealtimeState = usersRealtimeState;
    this._channelsRealtimeState = channelsRealtimeState;
  }

  init() {
    const peerSocketHandler = new PeerSocketHandler(
      this._socketServer,
      this._channelsRealtimeState,
      this._usersRealtimeState,
    );

    this._usersRealtimeState.emitter.on("userAdded", (user) => {
      this._socketServer.emit("userOnline", userDataToTransfer(user));
    });
    this._usersRealtimeState.emitter.on("userUpdated", (user) => {
      this._socketServer.emit("userUpdated", userDataToTransfer(user));
    });
    this._usersRealtimeState.emitter.on("userRemoved", (user) => {
      this._socketServer.emit("userOffline", userDataToTransfer(user));
    });

    this._channelsRealtimeState.emitter.on("channelAdded", (channel) => {
      this._socketServer.emit("channelCreated", channelDataToTransfer(channel));
      this.logger.log(`[WebSocketSystem]: channelCreated: '${channel.name}'`);
    });
    this._channelsRealtimeState.emitter.on("channelUpdated", (channel) => {
      this._socketServer.emit("channelUpdated", channelDataToTransfer(channel));
      this.logger.log(`[WebSocketSystem]: channelUpdated: '${channel.name}'`);
    });
    this._channelsRealtimeState.emitter.on("channelRemoved", (channel) => {
      this._socketServer.emit("channelRemoved", channelDataToTransfer(channel));
      this.logger.log(`[WebSocketSystem]: channelRemoved: '${channel.name}'`);
    });

    this._socketServer.on("connection", async (socket: Socket<CTS, STC>) => {
      const user: UserTransfer = await this.usersSerivce.getUserById(socket.handshake.auth.id);
      const currentUserOnline = this._usersRealtimeState.addUser(socket.id, user);
      this.logger.log(`[WebSocketSystem]: user ${user.name} id: ${user.id} connected`);

      socket.emit("syncState", {
        usersOnline: this._usersRealtimeState.getTransferObjectList(),
        channels: this._channelsRealtimeState.getTransferObjectList(),
      });

      socket.on("disconnect", () => {
        this._usersRealtimeState.removeUser(user.id);
        this.logger.log(`[WebSocketSystem]: user ${user.name} id: ${user.id} disconnected`);
      });

      socket.on("clientCreatesChannel", ({ name }, response) => {
        const channel = this._channelsRealtimeState.addChannel({
          name,
          ownerId: user.id,
        });
        socket.join(channel.id);
        response({ data: channelDataToTransfer(channel), status: "ok" });
        this.logger.log(`[WebSocketSystem]: user '${currentUserOnline.user.name}' creates channel '${channel.name}'`);
      });

      socket.on("clientJoinsChannel", async (channelId, response) => {
        const isTheSameChannel = channelId === currentUserOnline.currentChannel;
        const channel = this._channelsRealtimeState.addMemberInChannelById(channelId, user.id);

        if (channel) {
          this.logger.log(`[WebSocketSystem]: user ${user.name} joins channel ${channel.name}`);

          // если попытка зайти в канал, в котором уже есть - не пытаемся снести пользователя из канала
          if (!isTheSameChannel) {
            this._channelsRealtimeState.removeMemberFromChannelById(currentUserOnline.currentChannel, user.id);
          }

          this._usersRealtimeState.setChannel(user.id, channelId);
          socket.join(channel.id);
          peerSocketHandler.handlePeerConnect(socket, currentUserOnline, channel);

          response({ status: "ok", data: channelDataToTransfer(channel) });
        } else {
          response({ status: "error", error: "no channel" });
        }
      });

      socket.on("clientLeavesChannel", () => {
        const channel = this._channelsRealtimeState.removeMemberFromChannelById(
          currentUserOnline.currentChannel,
          user.id,
        );
        if (channel) {
          socket.leave(channel.id);
          peerSocketHandler.handlePeerDisconnect(socket, currentUserOnline, channel);
          this._usersRealtimeState.clearChannel(user.id);
          socket.leave(channel.id);
          this.logger.log(`[WebSocketSystem]: user ${user.name} leaves channel ${channel.name}`);
        }
      });

      peerSocketHandler.bindHandlers(socket, currentUserOnline);
    });
  }
}
