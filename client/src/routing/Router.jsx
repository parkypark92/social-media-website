import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import FindFriends from "../pages/FindFriends";
import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
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
          element: <Profile />,
        },
        {
          path: "/:userId/find-friends",
          element: (
            <ProtectedRoute>
              <FindFriends></FindFriends>
            </ProtectedRoute>
          ),
        },
        {
          path: "/:userId/friend-requests",
          element: (
            <ProtectedRoute>
              <FriendRequestsPreview></FriendRequestsPreview>
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
