import { expect, test, describe } from "vitest";
import { GeneralStore } from "./GeneralStore";

describe("GeneralStore testing", () => {
  test("correct user deleting", () => {
    const store = new GeneralStore();

    const user1 = {
      id: 1,
      name: "Vasya",
    };
    const user2 = {
      id: 1,
      name: "Petya",
    };

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
});

test("correct user deleting, changing owner when there is channel", () => {
  const store = new GeneralStore();

  const user1 = {
    id: 1,
    name: "Vasya",
  };
  const user2 = {
    id: 2,
    name: "Petya",
  };

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
