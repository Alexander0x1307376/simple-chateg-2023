export type User = {
  id: number;
  name: string;
  avaUrl?: string;
};

export type Channel = {
  id: string;
  name: string;
  members: number[];
};

export type ChannelData = {
  id: string;
  name: string;
  owner: User;
  members: User[];
};
