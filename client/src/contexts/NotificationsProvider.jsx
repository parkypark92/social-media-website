import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./SocketProvider";
import axios from "axios";
import PropTypes from "prop-types";

const NotificationsContext = createContext();

export function NotificationsProvider({ userId, children }) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/get-notifications`, {
      params: { userId },
    });
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
    if (!socket) return;
    socket.on("receive-notification", (notification) => {
      queryClient.invalidateQueries([
        "notifications",
        notification.recipientId,
      ]);
    });
    return () => socket.off("receive-notification");
  }, [queryClient, socket]);

  return (
    <NotificationsContext.Provider value={notificationsQuery}>
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
