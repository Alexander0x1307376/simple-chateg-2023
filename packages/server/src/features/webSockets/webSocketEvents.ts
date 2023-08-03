import { ChannelDto } from "../channels/ChannelDto";
import { UserDto } from "../users/dto/user.dto";

export type Response<T> = { status: "ok" | "error"; data: T; error?: string };

export type ClientToServerEvents = {
  clientJoinsChannel: (channelId: string) => void;
  clientLeavesChannel: (channelId: string) => void;
  clientCreatesChannel: (
    channelData: { name: string },
    response: (channel: Response<ChannelDto>) => void
  ) => void;
};

export type ServerToClientEvents = {
  userOnline: (userData: UserDto) => void;
  syncState: (data: { usersOnline: UserDto[] }) => void;
  userOffline: (userData: { userId: number; socketId: string }) => void;
  channelCreated: (channel: ChannelDto) => void;
  channelUpdated: (channel: ChannelDto) => void;
  channelRemoved: (channelId: string) => void;
};
