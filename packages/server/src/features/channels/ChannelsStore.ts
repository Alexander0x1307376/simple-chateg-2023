import { ChannelDto } from "./ChannelDto";

export type ChannelItem = {
  id: string;
  name: string;
  ownerId: number;
  members: Set<number>;
};

export class ChannelsStore {
  private _channels: Map<string, ChannelItem>;

  constructor() {
    this._channels = new Map();
  }

  getArray(): ChannelItem[] {
    return Array.from(this._channels, ([_, value]) => value);
  }

  getChannel(channelId: string): ChannelItem {
    return this._channels.get(channelId);
  }

  addChannel(channel: ChannelDto): ChannelItem {
    const newChannel = { ...channel, members: new Set<number>() };
    this._channels.set(channel.id, newChannel);
    return newChannel;
  }

  removeChannel(id: string) {
    return this._channels.delete(id);
  }

  addUserInChannel(channelId: string, userId: number): ChannelItem | undefined {
    const channel = this._channels.get(channelId);
    if (!channel) return undefined;
    channel.members.add(userId);
    return channel;
  }

  removeUserFromChannel(
    channelId: string,
    userId: number
  ): ChannelItem | undefined {
    const channel = this._channels.get(channelId);
    if (!channel) return undefined;

    if (channel.ownerId === userId) {
      const newOwnerId = Array.from(channel.members)[0];
      channel.ownerId = newOwnerId;
      channel.members.delete(newOwnerId);
    } else {
      channel.members.delete(userId);
    }

    return channel;
  }

  changeOwnerInChannel(
    channelId: string,
    newOwnerId: number
  ): ChannelItem | undefined {
    const channel = this._channels.get(channelId);
    if (!channel) return undefined;
    if (!channel.members.has(newOwnerId)) return undefined;
    const oldOwnerId = channel.ownerId;
    channel.members.delete(newOwnerId);
    channel.ownerId = newOwnerId;
    channel.members.add(oldOwnerId);
  }
}
