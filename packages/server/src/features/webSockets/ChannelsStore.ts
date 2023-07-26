export type Channel = { name: string };

export class ChannelsStore {
  channels: Map<string, Channel>;

  constructor() {
    this.channels = new Map();
  }

  getList() {
    return this.channels;
  }

  addChannel(channelRoom: string, name: string) {
    this.channels.set(channelRoom, { name });
  }

  removeUser(channelRoom: string) {
    this.channels.delete(channelRoom);
  }
}
