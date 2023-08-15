import { ChannelTransfer } from "../channels/channelTypes";
import { UserTransfer } from "../users/userTypes";
import { ChannelData } from "../channels/ChannelsRealtimeState";
import { UserData } from "../users/UsersRealtimeState";

export const channelDataToTransfer = (channelData: ChannelData): ChannelTransfer => ({
  id: channelData.id,
  name: channelData.name,
  ownerId: channelData.ownerId,
  members: Array.from(channelData.members, (value) => value.user.id),
});

export const userDataToTransfer = (userData: UserData): UserTransfer => ({
  id: userData.user.id,
  name: userData.user.name,
  avaUrl: userData.user.avaUrl,
});
