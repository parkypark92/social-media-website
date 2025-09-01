import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import PropTypes from "prop-types";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("like-notification", (likedBy) => {
      const notification = `${likedBy} liked your post!`;
      setNotifications([...notifications, notification]);
      console.log(notification);
      alert(notification);
    });
  }, [socket, notifications]);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

NotificationsProvider.propTypes = {
  children: PropTypes.node,
};
