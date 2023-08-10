import { EventEmitter } from "../eventEmitter/EventEmitter";
import { LoggerService } from "../logger/LoggerService";
import { ChannelData, ChannelsRealtimeState, ChannelsRealtimeStateEvents } from "./ChannelsRealtimeState";
import { UserData, UsersRealtimeState, UsersRealtimeStateEvents } from "./UsersRealtimeState";

// jest.useFakeTimers();

const delayedInvoke = (callback: () => void, time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, time);
  });

describe("тестирование ChannelRealtimeState", () => {
  let usersStore: Map<number, UserData>;
  let usersEmitter: EventEmitter<UsersRealtimeStateEvents>;

  let channelsStore: Map<string, ChannelData>;
  let channelsEmitter: EventEmitter<ChannelsRealtimeStateEvents>;
  let channelsRemoveTimers: Map<string, NodeJS.Timeout>;

  let usersRealtimeState: UsersRealtimeState;
  let channelsRealtimeState: ChannelsRealtimeState;

  const logger = new LoggerService();

  const user1 = {
    id: 1,
    name: "Vasya",
  };
  const user2 = {
    id: 1,
    name: "Patya",
  };
  const user3 = {
    id: 1,
    name: "Kolya",
  };
  const channel1 = {
    ownerId: 1,
    name: "channel1",
  };
  const channel2 = {
    ownerId: 1,
    name: "channel2",
  };
  const channel3 = {
    ownerId: 1,
    name: "channel3",
  };

  const DELAYED_REMOVE_TIME = 3000;

  beforeEach(() => {
    usersStore = new Map();
    usersEmitter = new EventEmitter();

    channelsStore = new Map();
    channelsEmitter = new EventEmitter();
    channelsRemoveTimers = new Map();

    usersRealtimeState = new UsersRealtimeState(usersStore, usersEmitter);
    channelsRealtimeState = new ChannelsRealtimeState(
      usersRealtimeState,
      channelsStore,
      channelsEmitter,
      channelsRemoveTimers,
      DELAYED_REMOVE_TIME,
      logger,
    );
  });

  test("корректное добавление пользователей в каналы", () => {
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    expect(addedChannel.name).toBe(channel1.name);
    expect(addedChannel.ownerId).toBe(channel1.ownerId);
    expect(addedChannel.members.size).toBe(0);
  });

  test("корректное добавление участников в каналы", () => {
    const addedUser = usersRealtimeState.addUser("socket1", user1);
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    const updatedChannel = channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser);

    expect(updatedChannel.members.has(addedUser)).toBe(true);
  });

  test("корректное удаление пользователей при наличии каналов и участников в них", () => {
    const addedUser1 = usersRealtimeState.addUser("socket1", user1);
    const addedUser2 = usersRealtimeState.addUser("socket2", user2);
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser1);
    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser2);

    const updatedChannel = channelsRealtimeState.removeMemberFromChannel(addedChannel.id, addedUser1);

    expect(updatedChannel.members.has(addedUser1)).toBe(false);
    expect(updatedChannel.members.has(addedUser2)).toBe(true);
  });

  test("корректное удаление записи в channel.members при удалении пользователя из usersRealtimeState", () => {
    const addedUser1 = usersRealtimeState.addUser("socket1", user1);
    const addedUser2 = usersRealtimeState.addUser("socket2", user2);
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser1);
    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser2);

    usersRealtimeState.removeUser(addedUser2.user.id);

    expect(addedChannel.members.has(addedUser1)).toBe(true);
    expect(addedChannel.members.has(addedUser2)).toBe(false);
    expect(addedChannel.members.size).toBe(1);
  });

  test("корректная постановка канала на удаление и, собственно, удаление", async () => {
    const addedUser1 = usersRealtimeState.addUser("socket1", user1);
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser1);
    channelsRealtimeState.removeMemberFromChannel(addedChannel.id, addedUser1);

    const isThereChannel = channelsStore.has(addedChannel.id);
    let isThereChannelAfter;
    await delayedInvoke(() => {
      isThereChannelAfter = channelsStore.has(addedChannel.id);
    }, 3200);

    expect(isThereChannel).toBe(true);
    expect(isThereChannelAfter).toBe(false);
  });

  test("корректная постановка и снятие канала с отложенного удаления", async () => {
    const addedUser1 = usersRealtimeState.addUser("socket1", user1);
    const addedUser2 = usersRealtimeState.addUser("socket2", user2);
    const addedChannel = channelsRealtimeState.addChannel(channel1);

    // добавляем первого юзера
    channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser1);

    // убираем первого юзера через пол-секунды
    await delayedInvoke(() => {
      channelsRealtimeState.removeMemberFromChannel(addedChannel.id, addedUser1);
    }, 500);

    // Таймер удаления должен быть установлен, участников быть не должно
    const isThereRemoveTimer = channelsRemoveTimers.has(addedChannel.id);
    const areThereMembers = addedChannel.members.size;

    // Добавляем второго юзера пока активен таймер удаления
    await delayedInvoke(() => {
      channelsRealtimeState.addMemberInChannel(addedChannel.id, addedUser2);
    }, 1000);

    // по окончанию не должно остаться записей о таймауте
    expect(isThereRemoveTimer).toBe(true);
    expect(areThereMembers).toBe(0);

    expect(channelsRemoveTimers.has(addedChannel.id)).toBe(false);
    expect(addedChannel.members.has(addedUser2)).toBe(true);
  });
});
