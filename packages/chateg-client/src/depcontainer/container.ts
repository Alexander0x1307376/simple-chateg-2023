import { UsersOnlineStore } from "../features/users/UsersOnlineStore";
import { AuthStore } from "../features/auth/AuthStore";
import { ChannelsStore } from "../features/channels/ChannelsStore";
import { HttpClient } from "../features/auth/HttpClient";
import { AuthQueryService } from "../features/auth/AuthQueryService";
import { WebsocketConnection } from "../features/webSockets/WebsocketConnection";
import { SocketQuerySystem } from "../features/webSockets/SocketQuerySystem";
import { RealtimeService } from "../RealtimeService";
import { UsersRealtimeSystem } from "../features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "../features/channels/ChannelsRealtimeSystem";
import { REFRESH_TOKEN_STORAGE_KEY } from "../config/config";

export const bootstrap = () => {
  const authStore = new AuthStore(
    undefined,
    localStorage,
    REFRESH_TOKEN_STORAGE_KEY
  );
  const channelsStore = new ChannelsStore();
  const usersOnlineStore = new UsersOnlineStore();

  const httpClient = new HttpClient("/api", authStore);
  const authQueryService = new AuthQueryService(
    httpClient,
    authStore,
    localStorage,
    REFRESH_TOKEN_STORAGE_KEY
  );

  const webSocketConnection = new WebsocketConnection("/");
  const userRealtimeSystem = new UsersRealtimeSystem(usersOnlineStore);
  const channelsRealtimeSystem = new ChannelsRealtimeSystem(channelsStore);
  const realtimeService = new RealtimeService(
    userRealtimeSystem,
    channelsRealtimeSystem
  );
  const socketQuerySystem = new SocketQuerySystem(channelsStore);

  return {
    authStore,
    channelsStore,
    usersOnlineStore,
    httpClient,
    authQueryService,
    webSocketConnection,
    userRealtimeSystem,
    channelsRealtimeSystem,
    realtimeService,
    socketQuerySystem,
  };
};
