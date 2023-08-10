import { EventEmitter } from "../eventEmitter/EventEmitter";
import { UsersRealtimeState } from "./UsersRealtimeState";

export class UsersRealtimeStateBuilder {
  static build() {
    const usersStore = new Map();
    const usersEmitter = new EventEmitter();
    const usersRealtimeState = new UsersRealtimeState(usersStore, usersEmitter);
    return {
      usersStore,
      usersEmitter,
      usersRealtimeState,
    };
  }
}
