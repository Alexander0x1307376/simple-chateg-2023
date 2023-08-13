import { ChannelTransfer } from "../channels/channelTypes";
import { EventEmitter } from "../eventEmitter/EventEmitter";
import { ILogger } from "../logger/ILogger";
import { UserData, UsersRealtimeState } from "./UsersRealtimeState";

export type ChannelData = {
  id: string;
  name: string;
  ownerId: number;
  members: Set<UserData>;
};

export type ChannelsRealtimeStateEvents = {
  channelAdded: (channel: ChannelData) => void;
  channelUpdated: (channel: ChannelData) => void;
  channelRemoved: (channel: ChannelData) => void;
};

export class ChannelsRealtimeState {
  constructor(
    private usersRealtimeState: UsersRealtimeState,
    private store: Map<string, ChannelData>,
    public emitter: EventEmitter<ChannelsRealtimeStateEvents>,
    private delayedRemoveTimers: Map<string, NodeJS.Timeout>,
    private delayedRemoveTime: number,
    private logger: ILogger,
  ) {
    this.handleUserRemove = this.handleUserRemove.bind(this);
    this.handleWatchMembers = this.handleWatchMembers.bind(this);

    this.addChannel = this.addChannel.bind(this);
    this.removeChannel = this.removeChannel.bind(this);
    this.addMemberInChannelById = this.addMemberInChannelById.bind(this);
    this.removeMemberFromChannelById = this.removeMemberFromChannelById.bind(this);
    this.addMemberInChannel = this.addMemberInChannel.bind(this);
    this.removeMemberFromChannel = this.removeMemberFromChannel.bind(this);
    this.findChannelByUserData = this.findChannelByUserData.bind(this);

    this.usersRealtimeState.emitter.on("userRemoved", this.handleUserRemove);
    this.emitter.on("channelUpdated", this.handleWatchMembers);
  }

  getTransferObjectList(): ChannelTransfer[] {
    return Array.from(this.store, ([_, channel]) => ({
      id: channel.id,
      name: channel.name,
      ownerId: channel.ownerId,
      members: Array.from(channel.members, (user) => user.user.id),
    }));
  }

  private handleWatchMembers(channel: ChannelData) {
    if (!channel.members.size) {
      this.delayedChannelRemove(channel);
    } else if (channel.members.size && this.delayedRemoveTimers.has(channel.id)) {
      this.cancelDelayedChannelRemove(channel);
    }
  }

  private delayedChannelRemove(channel: ChannelData) {
    const timer = setTimeout(() => {
      this.logger.log(`[ChannelsRealtimeState]: channel ${channel.name} has deleted`);
      this.removeChannel(channel.id);
      this.delayedRemoveTimers.delete(channel.id);
    }, this.delayedRemoveTime);
    this.delayedRemoveTimers.set(channel.id, timer);
  }

  private cancelDelayedChannelRemove(channel: ChannelData) {
    this.logger.log(`[ChannelsRealtimeState]: deleting ${channel.name} is canceled`);
    const timeout = this.delayedRemoveTimers.get(channel.id);
    if (timeout) {
      clearTimeout(timeout);
      this.delayedRemoveTimers.delete(channel.id);
    }
  }

  private handleUserRemove(user: UserData) {
    const channel = this.findChannelByUserData(user);
    if (channel) {
      channel.members.delete(user);
      this.emitter.emit("channelUpdated", channel);
    }
  }

  addChannel(channelData: Omit<ChannelData, "id" | "members">): ChannelData {
    const id = "channel_" + Date.now();
    const data = { ...channelData, id, members: new Set<UserData>() };
    this.store.set(id, data);
    this.emitter.emit("channelAdded", data);
    return data;
  }

  removeChannel(channelId: string): ChannelData {
    const removingChannel = this.store.get(channelId);
    if (removingChannel) {
      this.store.delete(channelId);
      this.emitter.emit("channelRemoved", removingChannel);
    }
    return removingChannel;
  }

  addMemberInChannelById(channelId: string, userId: number): ChannelData | undefined {
    const user = this.usersRealtimeState.getUser(userId);
    const channel = this.addMemberInChannel(channelId, user);
    return channel;
  }

  removeMemberFromChannelById(channelId: string, userId: number): ChannelData | undefined {
    const user = this.usersRealtimeState.getUser(userId);
    const channel = this.removeMemberFromChannel(channelId, user);
    return channel;
  }

  addMemberInChannel(channelId: string, user: UserData): ChannelData | undefined {
    const channel = this.store.get(channelId);
    if (channel) {
      channel.members.add(user);
      this.emitter.emit("channelUpdated", channel);
    }
    return channel;
  }

  removeMemberFromChannel(channelId: string, user: UserData): ChannelData | undefined {
    const channel = this.store.get(channelId);
    if (channel) {
      channel.members.delete(user);
      this.emitter.emit("channelUpdated", channel);
    }
    return channel;
  }

  private findChannelByUserData(user: UserData): ChannelData | undefined {
    for (const [_, channel] of this.store) {
      if (channel.members.has(user)) return channel;
    }
    return undefined;
  }
}
