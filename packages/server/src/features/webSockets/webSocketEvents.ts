import { ChannelTransfer } from "../channels/channelTypes";
import { DisconnectPeerData, IceCandidateData, PeerData, SPDData } from "../p2p/peerTypes";
import { UserTransfer } from "../users/userTypes";

export type Response<T> = { status: "ok" | "error"; data?: T; error?: string };

export type ClientToServerEvents = {
  clientJoinsChannel: (
    channelId: string,
    response: (channel: Response<ChannelTransfer>) => void,
  ) => Promise<void> | void;
  clientLeavesChannel: (channelId: string) => Promise<void> | void;
  clientCreatesChannel: (
    channelData: { name: string },
    response: (channel: Response<ChannelTransfer>) => void,
  ) => Promise<void> | void;
  relayICE: (answer: IceCandidateData) => Promise<void> | void;
  relaySDP: (answer: SPDData) => Promise<void> | void;
};

export type ServerToClientEvents = {
  userOnline: (userData: UserTransfer) => Promise<void> | void;
  syncState: (data: { usersOnline: UserTransfer[]; channels: ChannelTransfer[] }) => Promise<void> | void;
  userUpdated: (user: UserTransfer) => Promise<void> | void;
  userOffline: (user: UserTransfer) => Promise<void> | void;
  channelCreated: (channel: ChannelTransfer) => Promise<void> | void;
  channelUpdated: (channel: ChannelTransfer) => Promise<void> | void;
  channelRemoved: (channel: ChannelTransfer) => Promise<void> | void;
  // p2p
  addPeer: (answer: PeerData) => Promise<void> | void;
  removePeer: (peerData: DisconnectPeerData) => Promise<void> | void;
  ICECandidate: (answer: IceCandidateData) => Promise<void> | void;
  sessionDescription: (answer: SPDData) => Promise<void> | void;
};
