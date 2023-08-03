import { ChannelDto } from "@simple-chateg-2023/server/src/features/channels/ChannelDto";
import { BaseStore } from "../store/BaseStore";
import { produce } from "immer";

export type ChannelItem = {
  id: string;
  name: string;
  ownerId: number;
  members: Set<number>;
};
export type ChannelsData = Map<string, ChannelItem>;

export class ChannelsStore extends BaseStore<ChannelsData> {
  constructor(init: ChannelsData | undefined = undefined) {
    const initStore = init ? init : (new Map() as ChannelsData);
    super(initStore);
    this.addChannel = this.addChannel.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.removeChannel = this.removeChannel.bind(this);
    this.update = this.update.bind(this);
  }

  addChannel(channel: ChannelDto) {
    this.update((store) => {
      store.set(channel.id, { ...channel, members: new Set() });
    });
  }

  updateChannel(channel: ChannelDto) {
    this.update((store) => {
      const newChannelData = {
        ...channel,
        members: new Set<number>((channel?.members as number[]) || []),
      };
      store.set(channel.id, newChannelData);
    });
  }

  removeChannel(channelId: string) {
    this.update((store) => {
      store.delete(channelId);
    });
  }

  private update(callback: (prev: ChannelsData) => void) {
    const result = produce(this._store, callback);
    this.set(result);
  }
}
