import { User } from "@prisma/client";

export type ClientToServerEvents = {
  clientOnline: (userId: string) => void;
  clientOffline: (userId: string) => void;
  clientJoinsChannel: (userId: string) => void;
  clientLeavesChannel: (userId: string) => void;
  clientCreatesChannel: (channelData: { name: string }) => void;
};

export type ServerToClientEvents = {
  userOnline: (userData: User & { socketId: string }) => void;
  userOffline: (userData: User & { socketId: string }) => void;
  userJoinsChannel: (userId: number) => void;
  userLeavesChannel: (userId: number) => void;
};
