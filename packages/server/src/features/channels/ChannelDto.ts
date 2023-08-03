import { ChannelItem } from "./ChannelsStore";

export class ChannelDto {
  id: string;
  name: string;
  ownerId: number;
  members?: number[];

  constructor(channel: ChannelItem) {
    this.id = channel.id;
    this.name = channel.name;
    this.ownerId = channel.ownerId;
    if (channel.members) this.members = Array.from(channel.members);
  }
}
