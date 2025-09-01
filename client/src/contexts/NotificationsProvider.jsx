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
      setNotifications((prev) => [notification, ...prev]);
      console.log(notification);
    });
    return () => socket.off("like-notification");
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
