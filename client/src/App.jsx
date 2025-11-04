import "./App.css";
import Navbar from "./components/nav/Navbar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { SocketProvider } from "./contexts/SocketProvider";
import { OnlineUsersProvider } from "./contexts/OnlineUsers";
import { NotificationsProvider } from "./contexts/NotificationsProvider";
import { MessagesProvider } from "./contexts/MessagesProvider";
import { ScrollRestoration } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = { Authorization: token };
        const BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:3000";

        const response = await axios.get(`${BASE_URL}/users/authenticate`, {
          headers,
        });

        if (response.data.statusCode === 400) {
          setIsAuthenticated(false);
        } else {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsAuthenticated(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setIsAuthenticated(false);
    }
  }, [token, setUser]);

  const fetchFriends = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/get-friends`, {
      params: { id: user.id },
    });
    if (response.data.friendsList) {
      const friends = response.data.friendsList.map((friendship) => {
        if (friendship.senderId === user.id) {
          return friendship.receiver;
        } else {
          return friendship.sender;
        }
      });
      return friends;
    } else {
      throw new Error("An error has occurred");
    }
  };

  const friendsQuery = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: fetchFriends,
    enabled: !!user,
  });

  useEffect(() => {
    if (friendsQuery.isSuccess) {
      setFriendsList(friendsQuery.data);
    }
  }, [friendsQuery.data, friendsQuery.isSuccess]);

  const handleNotificationsDisplay = () => {
    if (notificationsIsOpen) {
      console.log("clicked");
      setNotificationsIsOpen(false);
    }
  };

  if (isAuthenticated === null) return <p>Loading...</p>;

  if (friendsQuery.isError) return <h2>{friendsQuery.error.message}</h2>;

  return (
    <div onClick={handleNotificationsDisplay}>
      <SocketProvider id={user?.id}>
        <MessagesProvider userId={user?.id}>
          <NotificationsProvider userId={user?.id}>
            <Navbar
              user={user}
              setUser={setUser}
              setIsAuthenticated={setIsAuthenticated}
              setFriendsList={setFriendsList}
              notificationsIsOpen={notificationsIsOpen}
              setNotificationsIsOpen={setNotificationsIsOpen}
            ></Navbar>
            <div className="navbarOffset"></div>
            <OnlineUsersProvider>
              <ScrollRestoration />
              <Outlet
                context={{
                  user,
                  setUser,
                  isAuthenticated,
                  setIsAuthenticated,
                  friendsList,
                }}
              />
            </OnlineUsersProvider>
          </NotificationsProvider>
        </MessagesProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
