import { AuthStore } from "../features/auth/AuthStore";
import { HttpClient } from "../features/auth/HttpClient";
import { AuthQueryService } from "../features/auth/AuthQueryService";
import { WebsocketConnection } from "../features/webSockets/WebsocketConnection";
import { SocketQuerySystem } from "../features/webSockets/SocketQuerySystem";
import { RealtimeService } from "../RealtimeService";
import { UsersRealtimeSystem } from "../features/users/UsersRealtimeSystem";
import { ChannelsRealtimeSystem } from "../features/channels/ChannelsRealtimeSystem";
import { REFRESH_TOKEN_STORAGE_KEY } from "../config/config";
import { SynchronizationRealtimeSystem } from "../features/synchronization/SynchronizationRealtimeSystem";
import { MediaStreamService } from "../features/videoStreams/MediaStreamService";
import { UsersService } from "../features/users/UsersService";
import { ChannelTransfer, User } from "../types/entities";
import { Store } from "../features/store/MegaStore/Store";
import { ChannelsService } from "../features/channels/ChannelsService";
import { SynchronizationService } from "../features/synchronization/SynchronizationService";
import { PeerRealtimeSystem } from "../features/peerConnection/PeerRealtimeSystem";
import { PeerService } from "../features/peerConnection/PeerService";
import { PeerConnections } from "../features/peerConnection/PeerConnections";

export const bootstrap = () => {
  const authStore = new AuthStore(undefined, localStorage, REFRESH_TOKEN_STORAGE_KEY);

  const httpClient = new HttpClient("/api", authStore);
  const authQueryService = new AuthQueryService(
    httpClient,
    authStore,
    localStorage,
    REFRESH_TOKEN_STORAGE_KEY,
  );

  const webSocketConnection = new WebsocketConnection("/");

  // Новая система состояний
  const usersStore = new Store<User>();
  const channelsStore = new Store<ChannelTransfer>([
    {
      emitter: usersStore,
      handleRemove: (id, _, store, methods) => {
        const userId = parseInt(id);
        for (const key in store) {
          const channel = store[key];
          const memberIndex = channel.members.indexOf(userId);
          if (memberIndex != -1) {
            channel.members.splice(memberIndex, 1);
            methods.update(key, channel);
          }
        }
      },
    },
  ]);
  const usersService = new UsersService(usersStore);
  const channelsService = new ChannelsService(channelsStore);
  const synchronizationService = new SynchronizationService(usersStore, channelsStore);

  const syncRealtimeSystem = new SynchronizationRealtimeSystem(synchronizationService);
  const userRealtimeSystem = new UsersRealtimeSystem(usersService);
  const channelsRealtimeSystem = new ChannelsRealtimeSystem(channelsService);

  const mediaStreamService = new MediaStreamService();

  const peerConnections = new PeerConnections(usersStore);
  const peerService = new PeerService(peerConnections, mediaStreamService);
  const peerRealtimeSystem = new PeerRealtimeSystem(peerService);

  const realtimeService = new RealtimeService([
    userRealtimeSystem,
    channelsRealtimeSystem,
    syncRealtimeSystem,
    peerRealtimeSystem,
  ]);

  const socketQuerySystem = new SocketQuerySystem();

  return {
    authStore,
    channelsStore,
    usersStore,
    httpClient,
    authQueryService,
    webSocketConnection,
    userRealtimeSystem,
    channelsRealtimeSystem,
    realtimeService,
    socketQuerySystem,
    mediaStreamService,
    usersService,
    channelsService,
    synchronizationService,
    peerRealtimeSystem,
    peerConnections,
  };
};
