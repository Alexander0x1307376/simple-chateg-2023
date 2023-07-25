import { IStore } from "../utils/IStore";
import type { AuthResponse as AuthData } from "./authTypes";

export type AuthDataStore = AuthData | undefined;

export class AuthSystem implements IStore<AuthDataStore> {
  private _authData: AuthDataStore;
  get authData() {
    return this._authData;
  }

  private subscriptions: ((data: AuthDataStore) => void)[];
  private storage: Storage;
  private readonly storageRefreshTokenKey: string;

  constructor(storage: Storage, storageRefreshTokenKey: string) {
    this.storage = storage;
    this.storageRefreshTokenKey = storageRefreshTokenKey;
    this.subscriptions = [];
  }

  private emit(value: AuthDataStore) {
    this.subscriptions.forEach((subscription) =>
      subscription.call(this, value)
    );
  }

  set(value: AuthDataStore) {
    this._authData = value;
    if (value) {
      this.storage.setItem(this.storageRefreshTokenKey, value.refreshToken);
    } else {
      this.storage.removeItem(this.storageRefreshTokenKey);
    }
    this.emit(value);
  }

  subscribe(subscription: (value: AuthDataStore) => void) {
    this.subscriptions.push(subscription);
    subscription(this._authData);
    return () => {
      this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    };
  }

  clear() {
    // console.log("[AuthSystem]: clear");
    this.set(undefined);
  }
}
