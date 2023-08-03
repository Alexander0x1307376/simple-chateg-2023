import { Server, Socket } from "socket.io";
import { ChannelsStore } from "./ChannelsStore";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../webSockets/webSocketEvents";
import { UserDto } from "../users/dto/user.dto";
import { ChannelDto } from "./ChannelDto";

export class ChannelsRealtimeSystem {
  constructor(
    private socketServer: Server<ClientToServerEvents, ServerToClientEvents>,
    private channelsStore: ChannelsStore
  ) {
    this.handleConnection = this.handleConnection.bind(this);
  }

  handleConnection(
    socket: Socket<ClientToServerEvents, ServerToClientEvents>,
    user: UserDto
  ) {
    socket.on("clientCreatesChannel", ({ name }, response) => {
      const newChannel = this.channelsStore.addChannel({
        id: "channel_" + Date.now(),
        name,
        ownerId: user.id,
      });

      const channelDto = new ChannelDto(newChannel);
      console.log("CHANNEL_CREATED", channelDto);

      socket.broadcast.emit("channelCreated", channelDto);
      response({
        status: "ok",
        data: channelDto,
      });
    });

    socket.on("clientJoinsChannel", (channelId) => {
      const updatedChannel = this.channelsStore.addUserInChannel(
        channelId,
        user.id
      );
      const channelDto = new ChannelDto(updatedChannel);
      console.log("CHANNEL_UPDATED", channelDto);
      socket.broadcast.emit("channelUpdated", channelDto);
    });

    socket.on("clientLeavesChannel", (channelId) => {
      const updatedChannel = this.channelsStore.removeUserFromChannel(
        channelId,
        user.id
      );
      const channelDto = new ChannelDto(updatedChannel);
      socket.broadcast.emit("channelUpdated", channelDto);
    });
  }
}
