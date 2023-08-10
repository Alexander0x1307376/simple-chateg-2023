import { produce } from "immer";
import { ChannelTransfer, User } from "../../types/entities";
import { BaseStore } from "./BaseStore";

export type State = {
  users: { list: Record<number, User>; ids: number[] };
  channels: { list: Record<string, ChannelTransfer>; ids: string[] };
};

export class GeneralStore extends BaseStore<State> {
  constructor() {
    super({
      users: { list: {}, ids: [] },
      channels: { list: {}, ids: [] },
    });

    this.upsertUser = this.upsertUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.upsertChannel = this.upsertChannel.bind(this);
    this.removeChannel = this.removeChannel.bind(this);
    this.removeUserFromChannel = this.removeUserFromChannel.bind(this);
    this.setState = this.setState.bind(this);
    this.update = this.update.bind(this);
  }

  upsertUser(user: User) {
    this.update((state) => {
      const users = state.users.list;
      const ids = state.users.ids;

      users[user.id] = user;
      if (!ids.includes(user.id)) ids.push(user.id);
    });
  }

  removeUser(userId: number) {
    this.update((state) => {
      const users = state.users.list;
      const ids = state.users.ids;
      // из users
      const index = ids.indexOf(userId);
      delete users[userId];
      if (index !== -1) ids.splice(index, 1);
      // из channels
      this.removeUserFromChannel(userId, state.channels.list, state.channels.ids);
    });
  }

  upsertChannel(channel: ChannelTransfer) {
    this.update((state) => {
      const isThereUser = state.users.ids.includes(channel.ownerId);
      if (!isThereUser) {
        console.warn(`no user with id: ${channel.ownerId}`);
        return;
      }

      const channels = state.channels.list;
      const ids = state.channels.ids;

      channels[channel.id] = channel;
      if (!ids.includes(channel.id)) ids.push(channel.id);
    });
  }

  removeChannel(channelId: string) {
    this.update((state) => {
      delete state.channels.list[channelId];
      const index = state.channels.ids.indexOf(channelId);
      if (index !== -1) state.channels.ids.splice(index, 1);
    });
  }

  setState(data: { users: User[]; channels: ChannelTransfer[] }) {
    this.set({
      channels: {
        list: data.channels.reduce(
          (acc, item) => {
            acc[item.id] = item;
            return acc;
          },
          {} as State["channels"]["list"],
        ),
        ids: data.channels.map((item) => item.id),
      },
      users: {
        list: data.users.reduce(
          (acc, item) => {
            acc[item.id] = item;
            return acc;
          },
          {} as State["users"]["list"],
        ),
        ids: data.users.map((item) => item.id),
      },
    });
  }

  private removeUserFromChannel(
    userId: number,
    channels: State["channels"]["list"],
    channelIds: string[],
  ) {
    const channelKey = Object.entries(channels).find(
      (entry) => entry[1].ownerId === userId || entry[1].members.includes(userId),
    )?.[0];
    if (!channelKey) return;

    const channel = channels[channelKey];
    if (!channel) return;

    // если сносим владельца - заменяем его первым пользователем из списка
    // если пользователей в канале нет - сносим канал
    const isUserOwner = channel.ownerId === userId;
    if (isUserOwner) {
      // проверяем, есть ли кто на замену
      if (channel.members.length) {
        channel.ownerId = channel.members[0];
        channel.members.splice(0, 1);
      } else {
        delete channels[channelKey];
        const index = channelIds.indexOf(channel.id);
        channelIds.splice(index, 1);
      }
      return;
    }
    const memberIndex = channel.members.indexOf(userId);
    if (memberIndex !== -1) channel.members.splice(memberIndex, 1);
  }

  private update(callback: (prev: State) => void) {
    const result = produce(this._store, callback);
    this.set(result);
  }
}
