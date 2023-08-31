import { PeerData, User } from "../../types/entities";
import { EventEmitter } from "../eventEmitter/EventEmitter";
import { IEntityEmitter, Store } from "../store/MegaStore/Store";

export type PeerEvents = {
  peerAdded: (peerId: string, peerData: PeerData) => void;
  streamsAdded: (peerId: string, streams: MediaStream[]) => void;
  peerRemoved: (peerId: string) => void;
  allPeersRemoved: () => void;
};

export type FullPeerData = {
  peerData: PeerData;
  connection: RTCPeerConnection;
  streams: MediaStream[];
};

export type PeerState = Record<string, PeerData>;

export class PeerConnections extends Store<PeerData> {
  // private _store: Map<string, PeerData>; // основное хранилище с данными для отображения
  private _userIndexes: Map<number, PeerData>;
  private _peers: Map<string, RTCPeerConnection>;
  private _streams: Map<string, MediaStream[]>;
  private _peerEmitter: EventEmitter<PeerEvents>;

  get peersByUsers() {
    return this._userIndexes;
  }

  constructor(userStoreEmitter: IEntityEmitter<User>) {
    super();

    this._peers = new Map();
    this._streams = new Map();
    this._userIndexes = new Map();

    this._peerEmitter = new EventEmitter();

    this.addPeer = this.addPeer.bind(this);
    this.addStreams = this.addStreams.bind(this);
    this.removePeer = this.removePeer.bind(this);
    this.getPeerData = this.getPeerData.bind(this);
    this.getPeerDataByUserId = this.getPeerDataByUserId.bind(this);

    userStoreEmitter.onEntityRemoved((id) => {
      const peerData = this._userIndexes.get(parseInt(id));
      if (peerData) {
        this.removePeer(peerData.peerId, false);
      }
    });
  }

  addPeer(peerId: string, data: { peerData: PeerData; connection: RTCPeerConnection }) {
    new Promise<{ peerId: string; peerData: PeerData }>((resolve) => {
      const { peerData, connection } = data;
      this._peers.set(peerId, connection);
      this._userIndexes.set(peerData.userId, peerData);
      resolve({ peerId, peerData });
    })
      .then(({ peerId, peerData }) => {
        this.addEntity(peerId, peerData);
        this._peerEmitter.emit("peerAdded", peerId, peerData);
      })
      .catch(() => {
        console.error(`[PeerConnections]: addPeer: error!`);
      });

    console.log(`[PeerConnections]:addPeer: ${peerId}`);
  }

  addStreams(peerId: string, streams: MediaStream[]) {
    if (peerId in this._store) {
      console.log("ADD_STREAMS", streams);
      this._streams.set(peerId, streams);
      this._peerEmitter.emit("streamsAdded", peerId, streams);
    }
  }

  removePeer(peerId: string, showMessage = true) {
    let peerData: PeerData | undefined = this._store[peerId];
    let connection = this._peers.get(peerId);
    let streams = this._streams.get(peerId);

    if (peerData && connection && streams) {
      connection.close();
      console.log(`[PeerConnections]:removePeer: peer: ${peerId} closed`);
      this._peers.delete(peerId);
      this._streams.delete(peerId);
      // нужно ли их вообще останавливать?!
      streams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log(`[PeerConnections]:removePeer: stream: track stopped`);
        });
      });
      peerData = connection = streams = undefined;

      this._peerEmitter.emit("peerRemoved", peerId);
      this.removeEntity(peerId);
    } else if (showMessage) {
      console.warn(`[PeerConnections]:removePeer: no peer with id: ${peerId}`);
    }
  }

  removeAllPeers() {
    this._store = {};
    this._peers.forEach((peer, key) => {
      peer.close();
      console.log(`[PeerConnections]:removeAllPeers: peer: ${key} closed`);
    });
    this._streams.forEach((streams) => {
      streams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
    });
    this._streams.clear();
    this._peers.clear();
    this._peerEmitter.emit("allPeersRemoved");
    this.emit(this._store);
  }

  getPeerData(peerId: string, showMessages = true): FullPeerData | undefined {
    const peerData = this._store[peerId];
    const connection = this._peers.get(peerId);
    const streams = this._streams.get(peerId);

    if (peerData && connection) {
      return { peerData, connection, streams: streams || [] };
    } else if (showMessages) {
      console.warn(`[PeerConnections]:getPeerData: no peer with id: ${peerId}`);
    }
  }

  getPeerDataByUserId(userId: number, showMessages = true): FullPeerData | undefined {
    const peerItem = this._userIndexes.get(userId);
    if (peerItem) {
      return this.getPeerData(peerItem.peerId, showMessages);
    } else if (showMessages) {
      console.warn(
        `[PeerConnections]:getPeerDataByUserId: no peerData for user with id: ${userId}`,
      );
    }
  }

  onPeerAdded(callback: PeerEvents["peerAdded"]) {
    this._peerEmitter.on("peerAdded", callback);
  }
  offPeerAdded(callback: PeerEvents["peerAdded"]) {
    this._peerEmitter.off("peerAdded", callback);
  }
  onStreamsAdded(callback: PeerEvents["streamsAdded"]) {
    this._peerEmitter.on("streamsAdded", callback);
  }
  offStreamsAdded(callback: PeerEvents["streamsAdded"]) {
    this._peerEmitter.off("streamsAdded", callback);
  }

  onPeerRemoved(callback: PeerEvents["peerRemoved"]) {
    this._peerEmitter.on("peerRemoved", callback);
  }
  offPeerRemoved(callback: PeerEvents["peerRemoved"]) {
    this._peerEmitter.off("peerRemoved", callback);
  }
  onAllPeersRemoved(callback: PeerEvents["allPeersRemoved"]) {
    this._peerEmitter.on("allPeersRemoved", callback);
  }
  offAllPeersRemoved(callback: PeerEvents["allPeersRemoved"]) {
    this._peerEmitter.off("allPeersRemoved", callback);
  }
}
