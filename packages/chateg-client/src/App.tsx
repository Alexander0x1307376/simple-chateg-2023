import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

enableMapSet();

const refreshMutex = new Mutex();
const {
  authStore,
  webSocketConnection,
  realtimeService,
  socketQuerySystem,
  authQueryService,
  channelsStore,
  usersOnlineStore,
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
    console.log(
      "[boot]: No auth data refreshed. Socket connection won't be established"
    );
  }
});

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/main",
        loader: async () => {
          console.log("Before mutex");
          await refreshMutex.waitForUnlock();
          console.log("After mutex");
          return null;
        },
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":meetingId",
            element: <MeetingSection />,
            loader: (args) => {
              const emitter = socketQuerySystem.emitters?.channelEmitter;
              const meetingId = args.params?.meetingId;
              const channel = channelsStore.store.get(meetingId!);
              const isOwner = channel?.ownerId === authStore.store?.userData.id;

              if (emitter && meetingId && !isOwner) {
                emitter.joinChannel(meetingId);
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
        <StoreContextProvider
          usersOnlineStore={usersOnlineStore}
          channelsStore={channelsStore}
        >
          <SocketEmitterProvider socketQuerySystem={socketQuerySystem}>
            <RouterProvider router={router} />
          </SocketEmitterProvider>
        </StoreContextProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
