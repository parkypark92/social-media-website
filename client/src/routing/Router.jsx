import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import FindFriends from "../pages/FindFriends";
import FriendRequests from "../pages/FriendRequests";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/:userId",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "profile/:userId",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/:userId/find-friends",
          element: (
            <ProtectedRoute>
              <FindFriends />
            </ProtectedRoute>
          ),
        },
        {
          path: "/:userId/friend-requests",
          element: (
            <ProtectedRoute>
              <FriendRequests />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
