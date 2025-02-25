import "./App.css";
import Navbar from "./components/nav/Navbar";
import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

function App() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
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

    if (token) {
      fetchUser();
    } else {
      setIsAuthenticated(false);
    }
  }, [token, setUser]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Navigate to={`/${user.id}`} />
      ) : (
        <Navigate to="/login" />
      )}
      <Navbar
        user={user}
        setUser={setUser}
        setIsAuthenticated={setIsAuthenticated}
      ></Navbar>
      <Outlet context={{ user, setUser }} />
    </>
  );
}

export default App;
