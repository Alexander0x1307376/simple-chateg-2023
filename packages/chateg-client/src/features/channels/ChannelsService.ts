import { ChannelTransfer } from "../../types/entities";
import { Store } from "../store/MegaStore/Store";

export class ChannelsService {
  constructor(private store: Store<ChannelTransfer>) {}

  upsertChannel(channel: ChannelTransfer) {
    this.store.updateEntity(channel.id, channel);
  }

  removeChannel(channelId: string) {
    this.store.removeEntity(channelId);
  }
}
