import "./App.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {user && (
        <div>
          <h1>{user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <Outlet context={{ user, setUser }} />
    </>
  );
}

export default App;
