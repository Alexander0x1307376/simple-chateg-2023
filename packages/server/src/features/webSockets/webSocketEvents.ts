import { ChannelTransfer } from "../channels/channelTypes";
import { DisconnectPeerData, IceCandidateData, PeerData } from "../p2p/peerTypes";
import { UserTransfer } from "../users/userTypes";

export type Response<T> = { status: "ok" | "error"; data?: T; error?: string };

export type ClientToServerEvents = {
  clientJoinsChannel: (channelId: string, response: (channel: Response<ChannelTransfer>) => void) => void;
  clientLeavesChannel: (channelId: string) => void;
  clientCreatesChannel: (channelData: { name: string }, response: (channel: Response<ChannelTransfer>) => void) => void;
  peerOffer: (offer: any) => void;
  peerAnswer: (answer: any) => void;

  relayICE: (answer: IceCandidateData) => void;
};

export type ServerToClientEvents = {
  userOnline: (userData: UserTransfer) => void;
  syncState: (data: { usersOnline: UserTransfer[]; channels: ChannelTransfer[] }) => void;
  userUpdated: (user: UserTransfer) => void;
  userOffline: (user: UserTransfer) => void;
  channelCreated: (channel: ChannelTransfer) => void;
  channelUpdated: (channel: ChannelTransfer) => void;
  channelRemoved: (channel: ChannelTransfer) => void;
  // p2p
  offer: (offer: any) => void;
  answer: (answer: any) => void;

  //
  addPeer: (answer: PeerData) => void;
  addPeers: (answer: PeerData[]) => void;
  removePeer: (peerData: DisconnectPeerData) => void;
  removePeers: (peerData: DisconnectPeerData[]) => void;
  // relaySDP: (answer: any) => void;
  // ICECandidate: (answer: any) => void;
  // sessionDescription: (answer: any) => void;
};
