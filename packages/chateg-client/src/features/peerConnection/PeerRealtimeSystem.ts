/* eslint-disable @typescript-eslint/no-misused-promises */
import { Socket } from "socket.io-client";
import { BaseWebSocketHandler } from "../webSockets/BaseWebSocketHandler";
import {
  ClientToServerEvents as CTS,
  ServerToClientEvents as STC,
} from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { PeerData } from "@simple-chateg-2023/server/src/features/p2p/peerTypes";
import { PeerService } from "./PeerService";

export type PeerEvents = Pick<
  STC,
  "addPeer" | "removePeer" | "ICECandidate" | "sessionDescription"
>;

export class PeerRealtimeSystem extends BaseWebSocketHandler {
  constructor(private peerService: PeerService) {
    super();
    this.init = this.init.bind(this);
  }

  private createHandleICECandidate(socket: Socket<PeerEvents, CTS>, peerData: PeerData) {
    return (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        socket.emit("relayICE", {
          peerId: peerData.peerId,
          userId: peerData.userId,
          channelId: peerData.channelId,
          iceCandidate: event.candidate,
        });
      }
    };
  }

  init(socket: Socket<PeerEvents, CTS>) {
    this.bindHandlers<PeerEvents>(socket, {
      //
      addPeer: async (peerData) => {
        const offer = await this.peerService.addPeer(peerData, {
          onICECandidate: this.createHandleICECandidate(socket, peerData),
        });
        if (offer) {
          socket.emit("relaySDP", {
            channelId: peerData.channelId,
            userId: peerData.userId,
            peerId: peerData.peerId,
            sessionDescription: offer,
          });
        }
      },
      //
      removePeer: ({ peerId }) => {
        this.peerService.removePeer(peerId);
      },
      //
      ICECandidate: ({ peerId, iceCandidate }) => {
        this.peerService.setICEData(peerId, iceCandidate);
      },
      //
      sessionDescription: async (SDPData) => {
        const answer = await this.peerService.handleSessionDescription(SDPData);
        if (answer) {
          socket.emit("relaySDP", {
            channelId: SDPData.channelId,
            peerId: SDPData.peerId,
            userId: SDPData.userId,
            sessionDescription: answer,
          });
        }
      },
    });
  }
}
