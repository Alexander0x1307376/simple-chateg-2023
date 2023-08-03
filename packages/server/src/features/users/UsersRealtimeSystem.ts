import { Server, Socket } from "socket.io";
import { UsersOnlineStore } from "../webSockets/UsersOnlineStore";
import { UsersService } from "./UsersService";
import { UserDto } from "./dto/user.dto";
import { ILogger } from "../logger/ILogger";

export class UsersRealtimeSystem {
  constructor(
    private socketServer: Server,
    private usersOnlineStore: UsersOnlineStore,
    private logger: ILogger
  ) {}

  handleConnection(socket: Socket, user: UserDto) {
    this.logger.log(
      `[UsersRealtimeSystem]: user ${user.name} ID: ${user.id} connected`
    );

    this.usersOnlineStore.addUser(user);

    socket.broadcast.emit("userOnline", user);
    socket.emit("syncState", {
      usersOnline: this.usersOnlineStore.getArray(),
    });

    socket.on("disconnect", (reason: any) => {
      this.logger.log(
        `[UsersRealtimeSystem]: user ${user.name} ID: ${user.id} disconnected`
      );

      this.usersOnlineStore.removeUser(user.id);
      this.socketServer.emit("userOffline", {
        userId: user.id,
        socketId: socket.id,
      });
    });
  }
}
