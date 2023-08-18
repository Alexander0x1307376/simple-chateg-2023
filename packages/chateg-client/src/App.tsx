import { FC } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MeetingSection from "./pages/home/pages/MeetingSection";
import AuthProvider from "./features/auth/authContext";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { Mutex } from "async-mutex";
import StoreContextProvider from "./features/store/storeContext";
import SocketEmitterProvider from "./features/webSockets/socketEmitterContext";
import { enableMapSet } from "immer";
import { bootstrap } from "./depcontainer/container";
import MediaStreamProvider from "./features/videoStreams/mediaStreamContext";

enableMapSet();

const refreshMutex = new Mutex();
const {
  authStore,
  webSocketConnection,
  realtimeService,
  socketQuerySystem,
  authQueryService,
  mediaStreamService,
  channelsStore,
  usersStore,
} = bootstrap();

authStore.subscribe((authData) => {
  if (!authData) return;
  webSocketConnection.connect(authData);
});

webSocketConnection.subscribe((socket) => {
  if (!socket) return;
  realtimeService.bindSocket(socket);
  socketQuerySystem.initEmitters(socket);
});

const initialRefresh = async () => {
  console.log("[boot]: App initialization...");
  await refreshMutex.acquire();
  await authQueryService.refresh();
  refreshMutex.release();
};
void initialRefresh().then(() => {
  if (authStore.authData) {
    console.log("[boot]: Auth data refreshed. Start socket connection");
  } else {
    console.log("[boot]: No auth data refreshed. Socket connection won't be established");
  }
});

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        loader: async () => {
          console.log(`[route-loader "/"]: Before mutex`);
          await refreshMutex.waitForUnlock();
          console.log(`[route-loader "/"]: After mutex`);
          return null;
        },
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":channelId",
            element: <MeetingSection />,
            loader: async (args) => {
              await refreshMutex.waitForUnlock();
              const emitter = socketQuerySystem.emitters?.channelEmitter;
              const channelId = args.params?.channelId;
              if (emitter && channelId) {
                console.log(`[route-loader "/:channelId"]: joining channel ${channelId} `);
                try {
                  await emitter.joinChannel(channelId);
                } catch (e) {
                  console.warn(`[route-loader "/:channelId"]:error:`, e as string);
                  return redirect("/");
                }
              }
              return null;
            },
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

const App: FC = () => {
  return (
    <div
      className="h-screen w-screen bg-slate-900 text-slate-300"
      onContextMenu={(e) => e.preventDefault()}
    >
      <AuthProvider authStore={authStore} authQueryService={authQueryService}>
        <StoreContextProvider usersStore={usersStore} channelsStore={channelsStore}>
          <SocketEmitterProvider socketQuerySystem={socketQuerySystem}>
            <MediaStreamProvider mediaStreamService={mediaStreamService}>
              <RouterProvider router={router} />
            </MediaStreamProvider>
          </SocketEmitterProvider>
        </StoreContextProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
