import { SPDData } from "@simple-chateg-2023/server/src/features/p2p/peerTypes";
import { PeerData } from "../../types/entities";
import { PeerConnections } from "./PeerConnections";
import freeice from "freeice";
import { MediaStreamService } from "../videoStreams/MediaStreamService";

export type HandlePeerConfig = {
  onICECandidate: (ev: RTCPeerConnectionIceEvent) => void;
};

export class PeerService {
  private _trackCount = 0;

  constructor(
    private peerConnections: PeerConnections,
    private mediaStreamService: MediaStreamService,
  ) {}

  // приём предложения присоединения от нового участника канала
  async addPeer(peerData: PeerData, { onICECandidate }: HandlePeerConfig) {
    const peerConnection = new RTCPeerConnection({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      iceServers: freeice(),
    });
    this.peerConnections.addPeer(peerData.peerId, {
      connection: peerConnection,
      peerData,
      streams: [],
    });

    peerConnection.addEventListener("icecandidate", onICECandidate);
    peerConnection.addEventListener("track", ({ streams }) => {
      this._trackCount++;
      if (this._trackCount === 2) {
        this._trackCount = 0;
        console.log("ONTRACK", streams);
        this.peerConnections.addStreams(peerData.peerId, streams as MediaStream[]);
      }
    });

    const stream = await this.mediaStreamService.getMediaStream();
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    console.log("PEER_CREATED:", { peerId: peerData.peerId, peerConnection });

    if (peerData.createOffer) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer).then(() => {
        console.log("SET_LOCAL_DESC:OFFER", { peerId: peerData.peerId });
      });
      return offer;
    }
    return undefined;
  }

  removePeer(peerId: string) {
    this.peerConnections.removePeer(peerId);
  }

  setICEData(peerId: string, iceCandidate: RTCIceCandidate) {
    const peerData = this.peerConnections.getPeerData(peerId);
    if (peerData) {
      void peerData.connection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    }
  }

  async handleSessionDescription(sDPData: SPDData) {
    const peerData = this.peerConnections.getPeerData(sDPData.peerId);
    if (peerData) {
      const { connection } = peerData;

      const offer = sDPData.sessionDescription;
      const remoteSessionDescription = new RTCSessionDescription(offer);
      void connection.setRemoteDescription(remoteSessionDescription);

      if (offer.type === "offer") {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer).then(() => {
          console.log("SET_LOCAL_DESC:ANSWER", { peerId: peerData.peerData.peerId });
        });
        return answer;
      }
    } else {
      console.error(`NO PEER DATA WITH ID: ${sDPData.peerId}`);
    }
  }
}
