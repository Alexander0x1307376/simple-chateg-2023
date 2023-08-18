export type User = {
  id: number;
  name: string;
  avaUrl?: string;
};

export type ChannelTransfer = {
  id: string;
  name: string;
  ownerId: number;
  members: number[];
};

export type ChannelData = {
  id: string;
  name: string;
  ownerId: number;
  members: User[];
};

export type PeerData = {
  peerId: string;
  userId: number;
  createOffer: boolean;
};
