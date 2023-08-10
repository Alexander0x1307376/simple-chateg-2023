export type ChannelItem = {
  id: string;
  name: string;
  ownerId: number;
  members: Set<number>;
};

export type ChannelTransfer = {
  id: string;
  name: string;
  ownerId: number;
  members: number[];
};
