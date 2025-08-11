import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import PropTypes from "prop-types";

const OnlineUsersContext = createContext();

export function OnlineUsersProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
}

export function useOnlineUsers() {
  return useContext(OnlineUsersContext);
}

OnlineUsersProvider.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};
