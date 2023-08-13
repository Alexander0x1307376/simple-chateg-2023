import { expect, test, describe, beforeEach } from "vitest";
import { GeneralStore } from "./GeneralStore";

describe("GeneralStore testing", () => {
  let store: GeneralStore;
  const user1 = {
    id: 1,
    name: "Vasya",
  };
  const user2 = {
    id: 2,
    name: "Petya",
  };

  beforeEach(() => {
    store = new GeneralStore();
  });

  test("correct users data updating", () => {
    store.upsertUser(user1);
    store.upsertUser(user2);
    store.upsertUser(user1);

    expect(Object.values(store.store.users.list).length).toBe(2);
    expect(store.store.users.ids.length).toBe(2);
    expect(store.store.users.list[1]).toEqual({
      id: 1,
      name: "Vasya",
    });
    expect(store.store.users.list[2]).toEqual({
      id: 2,
      name: "Petya",
    });
  });

  test("correct user deleting, including from channels", () => {
    store.upsertUser(user1);
    store.upsertUser(user2);

    store.upsertChannel({
      id: "ch1",
      name: "channel 1",
      ownerId: 1,
      members: [],
    });

    store.removeUser(1);

    // с удалением пользователя должен удалиться и канал, где он единственный участник (и владелец)
    const channelsCount = Object.values(store.store.channels.list).length;
    expect(store.store.channels.ids.length).toBe(0);
    expect(channelsCount).toBe(0);
  });

  test("correct user deleting, changing owner when there is channel", () => {
    store.upsertUser(user1);
    store.upsertUser(user2);

    store.upsertChannel({
      id: "ch1",
      name: "channel 1",
      ownerId: 1,
      members: [2],
    });

    store.removeUser(1);
    const assertingChannel = {
      id: "ch1",
      name: "channel 1",
      ownerId: 2,
      members: [],
    };

    expect(store.store.channels.list["ch1"]).toEqual(assertingChannel);
  });

  test("correct channels data updating", () => {
    store.upsertUser(user1);
    store.upsertUser(user2);
    store.upsertChannel({
      id: "ch1",
      name: "channel 1",
      ownerId: 1,
      members: [],
    });
    store.upsertChannel({
      id: "ch2",
      name: "channel 2",
      ownerId: 1,
      members: [],
    });
    store.upsertChannel({
      id: "ch1",
      name: "channel 1",
      ownerId: 1,
      members: [1, 2],
    });

    expect(Object.values(store.store.channels.list).length).toBe(2);
    expect(store.store.channels.ids.length).toBe(2);
    expect(store.store.channels.list["ch1"]).toEqual({
      id: "ch1",
      name: "channel 1",
      ownerId: 1,
      members: [1, 2],
    });
    expect(store.store.channels.list["ch2"]).toEqual({
      id: "ch2",
      name: "channel 2",
      ownerId: 1,
      members: [],
    });
  });

  // test("channels data updating, when there no user", () => {

  // });
});
