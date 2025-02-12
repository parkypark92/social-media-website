import "./App.css";
import Navbar from "./components/nav/Navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar user={user} setUser={setUser}></Navbar>
      <Outlet context={{ user, setUser }} />
    </>
  );
}

export default App;
