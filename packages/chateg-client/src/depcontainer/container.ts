import { AuthStore } from "../features/auth/AuthStore";
import { HttpClient } from "../features/auth/HttpClient";
import { AuthQueryService } from "../features/auth/AuthQueryService";
import { WebsocketConnection } from "../features/webSockets/WebsocketConnection";
import { SocketQuerySystem } from "../features/webSockets/SocketQuerySystem";
import { RealtimeService } from "../RealtimeService";
import { UsersRealtimeSystem } from "../features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "../features/channels/ChannelsRealtimeSystem";
import { REFRESH_TOKEN_STORAGE_KEY } from "../config/config";
import { GeneralStore } from "../features/store/GeneralStore";
import { SynchronizationRealtimeSystem } from "../features/webSockets/SynchronizationRealtimeSystem";

export const bootstrap = () => {
  const authStore = new AuthStore(undefined, localStorage, REFRESH_TOKEN_STORAGE_KEY);
  const store = new GeneralStore();

  const httpClient = new HttpClient("/api", authStore);
  const authQueryService = new AuthQueryService(
    httpClient,
    authStore,
    localStorage,
    REFRESH_TOKEN_STORAGE_KEY,
  );

  const webSocketConnection = new WebsocketConnection("/");

  const syncRealtimeSystem = new SynchronizationRealtimeSystem(store);
  const userRealtimeSystem = new UsersRealtimeSystem(store);
  const channelsRealtimeSystem = new ChannelsRealtimeSystem(store);

  const realtimeService = new RealtimeService(
    userRealtimeSystem,
    channelsRealtimeSystem,
    syncRealtimeSystem,
  );

  const socketQuerySystem = new SocketQuerySystem(store);

  return {
    authStore,
    store,
    httpClient,
    authQueryService,
    webSocketConnection,
    userRealtimeSystem,
    channelsRealtimeSystem,
    realtimeService,
    socketQuerySystem,
  };
};
