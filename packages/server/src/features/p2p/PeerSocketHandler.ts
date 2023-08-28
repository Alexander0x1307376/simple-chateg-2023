import { Server, Socket } from "socket.io";
import { ClientToServerEvents as CTS, ServerToClientEvents as STC } from "../webSockets/webSocketEvents";
import { UserData, UsersRealtimeState } from "../users/UsersRealtimeState";
import { ChannelData, ChannelsRealtimeState } from "../channels/ChannelsRealtimeState";
import { DisconnectPeerData } from "./peerTypes";

export class PeerSocketHandler {
  private readonly _peerPrefix = "peer_";

  constructor(
    private socketServer: Server<CTS, STC>,
    private channelsRealtimeState: ChannelsRealtimeState,
    private usersRealtimeState: UsersRealtimeState,
  ) {}

  bindHandlers(socket: Socket<CTS, STC>, currentUserOnline: UserData) {
    socket.on("relayICE", (iceData) => {
      this.socketServer.to(iceData.peerId).emit("ICECandidate", {
        channelId: iceData.channelId,
        peerId: socket.id,
        userId: currentUserOnline.user.id,
        iceCandidate: iceData.iceCandidate,
      });
    });

    socket.on("relaySDP", (sdpData) => {
      this.socketServer.to(sdpData.peerId).emit("sessionDescription", {
        channelId: sdpData.channelId,
        userId: currentUserOnline.user.id,
        peerId: socket.id,
        sessionDescription: sdpData.sessionDescription,
      });
    });
  }

  // юзер коннектится к пирам канала (срабатывает при событии clientJoinsChannel)
  handlePeerConnect(socket: Socket<CTS, STC>, { user, socketId }: UserData, channel: ChannelData) {
    socket.join(this._peerPrefix + channel.id);
    // Рассылка пир оферов от текущего сокета всем членам канала
    socket.in(channel.id).emit("addPeer", {
      peerId: socket.id,
      userId: user.id,
      channelId: channel.id,
      createOffer: false,
    });
    // от всех членов канала текущему сокету
    Array.from(channel.members)
      .filter((member) => member.socketId !== socketId)
      .map((member) => ({
        peerId: member.socketId,
        userId: member.user.id,
        channelId: channel.id,
        createOffer: true,
      }))
      .forEach((peerData) => {
        socket.emit("addPeer", peerData);
      });
  }

  async handlePeerDisconnect(socket: Socket<CTS, STC>, user: UserData, channel: ChannelData) {
    socket.in(channel.id).emit("removePeer", { peerId: socket.id });
    const channelSockets = await socket.in(channel.id).fetchSockets();
    const channelMembersPeerData: DisconnectPeerData[] = channelSockets.map((remoteSocket) => ({
      peerId: remoteSocket.id,
    }));
    channelMembersPeerData.forEach((peerData) => {
      socket.emit("removePeer", { peerId: peerData.peerId });
    });
    socket.leave(this._peerPrefix + channel.id);
  }
}
