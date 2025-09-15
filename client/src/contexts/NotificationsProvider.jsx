import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "./SocketProvider";
import axios from "axios";
import PropTypes from "prop-types";

const NotificationsContext = createContext();

export function NotificationsProvider({ userId, children }) {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  const fetchNotifications = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/get-notifications",
      {
        params: { userId },
      }
    );
    if (response.status === 200) {
      return response.data.notifications;
    } else {
      throw new Error("Error fetching notifications");
    }
  };

  const notificationsQuery = useQuery({
    queryKey: ["notifications", userId],
    queryFn: fetchNotifications,
    enabled: userId !== undefined,
  });

  useEffect(() => {
    if (notificationsQuery.isSuccess) {
      console.log(notificationsQuery.data);
      setNotifications(notificationsQuery.data);
    }
  }, [notificationsQuery.data, notificationsQuery.isSuccess]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      console.log(notification);
    });
    return () => socket.off("receive-notification");
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
  userId: PropTypes.string,
  children: PropTypes.node,
};
