import { User } from "../../types/entities";
import { IStore } from "../utils/IStore";

export type UsersStore = User[];

export class UsersOnlineStore implements IStore<UsersStore> {
  private _usersStore: UsersStore;
  private subscriptions: ((data: UsersStore) => void)[];

  constructor() {
    this._usersStore = [];
    this.subscriptions = [];

    this.update = this.update.bind(this);
    this.set = this.set.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.emit = this.emit.bind(this);
  }

  update(callback: (prev: UsersStore) => UsersStore) {
    this.set(callback(this._usersStore));
  }

  set(value: UsersStore) {
    this._usersStore = value;
    this.emit(value);
  }

  subscribe(subscription: (value: UsersStore) => void) {
    this.subscriptions.push(subscription);
    subscription(this._usersStore);
    return () => {
      this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    };
  }

  private emit(value: UsersStore) {
    this.subscriptions.forEach((subscription) => subscription(value));
  }
}
