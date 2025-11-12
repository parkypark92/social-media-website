import axios from "axios";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedRoute({ children }) {
  console.log("protected");
  const token = localStorage.getItem("token");
  const { setUser, isAuthenticated, setIsAuthenticated } = useOutletContext();

  const fetchUser = async () => {
    const headers = { Authorization: token };
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/authenticate`, {
      headers,
    });
    if (response.data.statusCode === 400) throw new Error("unauthorized");
    if (!response.data) throw new Error("no data");
    if (response.status === 200) return response.data;
  };

  const userQuery = useQuery({
    queryKey: ["user", token],
    queryFn: fetchUser,
    retry: false,
  });

  useEffect(() => {
    if (userQuery.isError) {
      setIsAuthenticated(false);
    }

    if (userQuery.isSuccess) {
      setUser(userQuery.data);
      setIsAuthenticated(true);
    }
  }, [
    setIsAuthenticated,
    setUser,
    userQuery.data,
    userQuery.isError,
    userQuery.isSuccess,
  ]);

  if (userQuery.isLoading) return <h2>Loading...</h2>;

  if (userQuery.isError) return <Navigate to="/login" />;

  return isAuthenticated && children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};
