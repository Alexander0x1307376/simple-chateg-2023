import { produce } from "immer";
import { User } from "../../types/entities";
import { BaseStore } from "../store/BaseStore";

export type UsersData = Map<number, User>;

export class UsersOnlineStore extends BaseStore<UsersData> {
  constructor(init: UsersData | undefined = undefined) {
    const initStore = init ? init : (new Map() as UsersData);
    super(initStore);
    this.addUser = this.addUser.bind(this);
  }

  setUsers(user: User[]) {
    const newMap = new Map(user.map((item) => [item.id, item]));
    this.set(newMap);
  }

  addUser(user: User) {
    this.update((store) => {
      store.set(user.id, user);
    });
  }

  removeUser(userId: number) {
    this.update((store) => {
      store.delete(userId);
    });
  }

  update(callback: (prev: UsersData) => void) {
    const result = produce(this._store, callback);
    this.set(result);
  }
}
