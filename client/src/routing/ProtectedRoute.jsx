import axios from "axios";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const { setUser, isAuthenticated, setIsAuthenticated } = useOutletContext();

  const fetchUser = async () => {
    const headers = { Authorization: token };
    const response = await axios.get(
      "http://localhost:3000/users/authenticate",
      { headers }
    );
    if (response.data.statusCode === 400) throw new Error("unauthorized");
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

  return isAuthenticated ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};
