import { FC } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MeetingSection from "./pages/home/pages/MeetingSection";
import AuthProvider from "./features/auth/authContext";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { HttpClient } from "./features/auth/HttpClient";
import { AuthStore } from "./features/auth/AuthStore";
import { REFRESH_TOKEN_STORAGE_KEY } from "./config/config";
import { AuthQueryService } from "./features/auth/AuthQueryService";
import { Mutex } from "async-mutex";
import { WebsocketSystem } from "./features/webSockets/WebSocketSystem";
import { UsersOnlineStore } from "./features/users/UsersOnlineStore";
import UsersOnlineProvider from "./features/users/usersOnlineContext";

const refreshMutex = new Mutex();
const authSystem = new AuthStore(localStorage, REFRESH_TOKEN_STORAGE_KEY);
const usersOnlineStore = new UsersOnlineStore();
const websocketSystem = new WebsocketSystem("/", authSystem, usersOnlineStore);
const httpClient = new HttpClient("/api", authSystem);
const authQueryService = new AuthQueryService(
  httpClient,
  authSystem,
  localStorage,
  REFRESH_TOKEN_STORAGE_KEY
);

authSystem.subscribe((authData) => {
  if (authData && !websocketSystem.isConnected) {
    websocketSystem.init();
    websocketSystem.connect();
  }
});

const initialRefresh = async () => {
  console.log("[boot]: App initialization...");
  await refreshMutex.acquire();
  await authQueryService.refresh();
  refreshMutex.release();
};
void initialRefresh().then(() => {
  if (authSystem.authData) {
    console.log("[boot]: Auth data refreshed. Start socket connection");
  } else {
    console.log(
      "[boot]: No auth data refreshed. Socket connection won't be established"
    );
  }
});

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider authStore={authSystem} authQueryService={authQueryService}>
        <UsersOnlineProvider usersOnlineStore={usersOnlineStore}>
          <Outlet />
        </UsersOnlineProvider>
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        loader: async () => {
          await refreshMutex.acquire();
          return null;
        },
        // element: <Home />,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":meetingId",
            element: <MeetingSection />,
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
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
