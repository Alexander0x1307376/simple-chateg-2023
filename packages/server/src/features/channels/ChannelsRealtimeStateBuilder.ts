import { EventEmitter } from "../eventEmitter/EventEmitter";
import { ILogger } from "../logger/ILogger";
import { ChannelsRealtimeState } from "./ChannelsRealtimeState";
import { UsersRealtimeState } from "../users/UsersRealtimeState";

export class ChannelsRealtimeStateBuilder {
  static build(usersRealtimeState: UsersRealtimeState, delayedRemoveTime: number, logger: ILogger) {
    const channelsStore = new Map();
    const channelsEmitter = new EventEmitter();
    const channelsRemoveTimers = new Map();

    const channelsRealtimeState = new ChannelsRealtimeState(
      usersRealtimeState,
      channelsStore,
      channelsEmitter,
      channelsRemoveTimers,
      delayedRemoveTime,
      logger,
    );

    return {
      channelsStore,
      channelsEmitter,
      channelsRemoveTimers,
      channelsRealtimeState,
    };
  }
}
