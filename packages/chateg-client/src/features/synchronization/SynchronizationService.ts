import { ChannelTransfer, User } from "../../types/entities";
import { Store } from "../store/MegaStore/Store";

export class SynchronizationService {
  constructor(
    private usersStore: Store<User>,
    private channelsStore: Store<ChannelTransfer>,
  ) {}

  setState(data: { users: User[]; channels: ChannelTransfer[] }) {
    const { users, channels } = data;

    const usersData = users.reduce(
      (acc, item) => {
        acc[item.id.toString()] = item;
        return acc;
      },
      {} as Record<string, User>,
    );

    const channelsData = channels.reduce(
      (acc, item) => {
        acc[item.id] = item;
        return acc;
      },
      {} as Record<string, ChannelTransfer>,
    );

    this.usersStore.setList(usersData);
    this.channelsStore.setList(channelsData);
  }
}
