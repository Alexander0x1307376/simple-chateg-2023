import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import MeetingSection from "./pages/home/pages/MeetingSection";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
]);

const App: FC = () => {
  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-300">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
