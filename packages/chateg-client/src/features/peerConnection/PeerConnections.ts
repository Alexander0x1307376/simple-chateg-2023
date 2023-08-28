import { PeerData, User } from "../../types/entities";
import { IEntityEmitter, Store } from "../store/MegaStore/Store";

export type PeerItem = {
  peerData: PeerData;
  connection: RTCPeerConnection;
  streams: MediaStream[];
};

export type PeerEvents = {
  peerAdded: (peerItem: PeerItem) => void;
  streamAdded: (peerItem: PeerItem) => void;
};

export type PeerState = Record<string, PeerItem>;

export class PeerConnections extends Store<PeerItem> {
  private _userIndexes: Map<number, PeerItem>;
  get peersByUsers() {
    return this._userIndexes;
  }

  constructor(userStoreEmitter: IEntityEmitter<User>) {
    super(undefined, false);
    this._userIndexes = new Map();
    this.addPeer = this.addPeer.bind(this);
    this.addStreams = this.addStreams.bind(this);
    this.removePeer = this.removePeer.bind(this);
    this.getPeerData = this.getPeerData.bind(this);
    this.getPeerItemByUserId = this.getPeerItemByUserId.bind(this);

    userStoreEmitter.onEntityRemoved((id) => {
      const peerData = this.getPeerItemByUserId(parseInt(id));
      if (peerData) {
        this.removePeer(peerData.peerData.peerId);
      }
    });
  }

  addPeer(peerId: string, peerItem: PeerItem) {
    this.addEntity(peerId, peerItem);
    this._userIndexes.set(peerItem.peerData.userId, peerItem);
    console.log(`[PeerConnections]:addPeer: ${peerId}`);
  }
  addStreams(peerId: string, streams: MediaStream[]) {
    if (peerId in this._store) {
      const entity = this._store[peerId];
      this.updateEntity(peerId, { ...entity, streams });
      console.log(`[PeerConnections]:addStreams: streams added to peer: ${peerId}`);
    } else {
      console.warn(`[PeerConnections]:addStreams: no peer with id: ${peerId}`);
    }
  }
  removePeer(peerId: string) {
    const peerData = this.getPeerData(peerId);
    if (peerData) {
      peerData.connection.close();
      this.removeEntity(peerId);
    } else {
      console.warn(`[PeerConnections]:removePeer: no peer with id: ${peerId}`);
    }
  }

  getPeerData(peerId: string): PeerItem | undefined {
    if (peerId in this._store) {
      return this._store[peerId];
    } else {
      console.warn(`[PeerConnections]:getPeerData: no peer with id: ${peerId}`);
    }
  }

  getPeerItemByUserId(userId: number): PeerItem | undefined {
    const peerItem = this._userIndexes.get(userId);
    if (peerItem) {
      return peerItem;
    } else {
      console.warn(
        `[PeerConnections]:getPeerItemByUserId: no peerData for user with id: ${userId}`,
      );
    }
  }
  // getPeerDataByUserId(userId: number): PeerItem | undefined {
  //   for (const key in this._store) {
  //     const peerItem = this._store[key];
  //     if (peerItem.peerData.userId === userId) {
  //       return peerItem;
  //     }
  //   }
  //   console.warn(`[PeerConnections]:getPeerDataByUserId: no peer data with userId: ${userId}`);
  //   return undefined;
  // }
}
