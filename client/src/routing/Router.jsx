import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProfilePicturePrompt from "../pages/ProfilePicturePrompt";
import FindFriends from "../pages/FindFriends";
import FriendRequests from "../pages/FriendRequests";
import FriendsList from "../pages/FriendsList";
import Friends from "../pages/Friends";
import Messages from "../pages/Messages";
import SinglePost from "../pages/SinglePost";
import SavedPosts from "../pages/SavedPosts";
import UploadPicture from "../pages/UploadPicture";
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
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
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
          path: "/:userId/welcome",
          element: (
            <ProtectedRoute>
              <ProfilePicturePrompt></ProfilePicturePrompt>
            </ProtectedRoute>
          ),
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
          path: "/:userId/friends-list",
          element: (
            <ProtectedRoute>
              <FriendsList></FriendsList>
            </ProtectedRoute>
          ),
        },
        {
          path: "/:userId/friends",
          element: (
            <ProtectedRoute>
              <Friends></Friends>
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
          path: "/:userId/saved",
          element: (
            <ProtectedRoute>
              <SavedPosts></SavedPosts>
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
        {
          path: "/profile/:userId/upload-profile-picture",
          element: (
            <ProtectedRoute>
              <UploadPicture />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
