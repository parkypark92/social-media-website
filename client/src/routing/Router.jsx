import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import FindFriends from "../pages/FindFriends";
import FriendRequests from "../pages/FriendRequests";
import Messages from "../pages/Messages";
import SinglePost from "../pages/SinglePost";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";

const Router = () => {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/login" />,
        },
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
        {
          path: "/:userId/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post/:postId",
          element: (
            <ProtectedRoute>
              <SinglePost />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
