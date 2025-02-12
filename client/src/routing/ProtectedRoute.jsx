import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const { setUser } = useOutletContext();
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

  return isAuthenticated ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};
