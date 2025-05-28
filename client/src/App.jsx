import "./App.css";
import Navbar from "./components/nav/Navbar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

function App() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = { Authorization: token };
        const response = await axios.get(
          "http://localhost:3000/users/authenticate",
          { headers }
        );

        if (response.data.statusCode === 401) {
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

    localStorage.removeItem("user");

    if (token) {
      fetchUser();
    } else {
      setIsAuthenticated(false);
    }
  }, [token, setUser]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/get-friends",
        { params: { id: user.id } }
      );
      if (response.status === 200) {
        const friends = response.data.friendsList.map((friendship) => {
          if (friendship.senderId === user.id) {
            return friendship.receiver;
          } else {
            return friendship.sender;
          }
        });
        setFriendsList(friends);
      } else {
        console.log("Error");
      }
    };
    user && fetchFriends();
  }, [user]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar
        user={user}
        setUser={setUser}
        setIsAuthenticated={setIsAuthenticated}
        setFriendsList={setFriendsList}
      ></Navbar>
      <div className="navbarOffset"></div>
      <Outlet
        context={{
          user,
          setUser,
          isAuthenticated,
          setIsAuthenticated,
          friendsList,
        }}
      />
    </>
  );
}

export default App;
