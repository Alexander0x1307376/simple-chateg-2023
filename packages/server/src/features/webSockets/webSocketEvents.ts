import { ChannelTransfer } from "../channels/channelTypes";
import { UserTransfer } from "../users/userTypes";

export type Response<T> = { status: "ok" | "error"; data?: T; error?: string };

export type ClientToServerEvents = {
  clientJoinsChannel: (
    channelId: string,
    response: (channel: Response<ChannelTransfer>) => void,
  ) => void;
  clientLeavesChannel: (channelId: string) => void;
  clientCreatesChannel: (
    channelData: { name: string },
    response: (channel: Response<ChannelTransfer>) => void,
  ) => void;
};

export type ServerToClientEvents = {
  userOnline: (userData: UserTransfer) => void;
  syncState: (data: { usersOnline: UserTransfer[]; channels: ChannelTransfer[] }) => void;
  userUpdated: (user: UserTransfer) => void;
  userOffline: (user: UserTransfer) => void;
  channelCreated: (channel: ChannelTransfer) => void;
  channelUpdated: (channel: ChannelTransfer) => void;
  channelRemoved: (channel: ChannelTransfer) => void;
};
