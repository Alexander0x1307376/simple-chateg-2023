import { FC } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MeetingSection from "./pages/home/pages/MeetingSection";
import AuthProvider from "./features/auth/authContext";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { HttpClient } from "./features/auth/HttpClient";
import { AuthSystem } from "./features/auth/AuthSystem";
import { REFRESH_TOKEN_STORAGE_KEY } from "./config/config";
import { AuthQueryService } from "./features/auth/AuthQueryService";
import { Mutex } from "async-mutex";

const refreshMutex = new Mutex();
const authSystem = new AuthSystem(localStorage, REFRESH_TOKEN_STORAGE_KEY);
const httpClient = new HttpClient("/api", authSystem);
const authQueryService = new AuthQueryService(
  httpClient,
  authSystem,
  localStorage,
  REFRESH_TOKEN_STORAGE_KEY
);

const initialRefresh = async () => {
  await refreshMutex.acquire();
  await authQueryService.refresh();
  refreshMutex.release();
};
void initialRefresh();

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider authSystem={authSystem} authQueryService={authQueryService}>
        <Outlet />
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
    <div className="h-screen w-screen bg-slate-900 text-slate-300">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
