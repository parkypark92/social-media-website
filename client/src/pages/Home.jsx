import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setUser } = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      const headers = { Authorization: token };
      const response = await axios.get(
        "http://localhost:3000/users/authenticate",
        {
          headers,
        }
      );
      if (response.data.statusCode == 401) {
        navigate("/login");
      } else {
        setUser(response.data);
      }
    };
    if (token) {
      fetchUser(token);
    } else {
      navigate("/login");
    }
  }, [navigate, setUser, token]);
  return <h1>Home</h1>;
}
