import { UserDto } from "../users/dto/user.dto";

export type ClientToServerEvents = {
  clientJoinsChannel: (userId: string) => void;
  clientLeavesChannel: (userId: string) => void;
  clientCreatesChannel: (channelData: { name: string }) => void;
};

export type ServerToClientEvents = {
  userOnline: (userData: UserDto) => void;
  syncState: (data: { usersOnline: UserDto[] }) => void;
  userOffline: (userData: { userId: number; socketId: string }) => void;
  userJoinsChannel: (userId: number) => void;
  userLeavesChannel: (userId: number) => void;
};
