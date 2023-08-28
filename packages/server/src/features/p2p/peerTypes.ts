export type PeerData = {
  peerId: string;
  userId: number;
  channelId: string;
  createOffer: boolean;
};

export type DisconnectPeerData = {
  peerId: string;
};

export type IceCandidateData = {
  peerId: string;
  userId: number;
  channelId: string;
  iceCandidate: RTCIceCandidate;
};

export type SPDData = {
  peerId: string;
  userId: number;
  channelId: string;
  sessionDescription: RTCSessionDescriptionInit;
};
