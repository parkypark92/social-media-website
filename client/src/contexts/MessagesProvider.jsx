import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./SocketProvider.jsx";
import axios from "axios";
import PropTypes from "prop-types";

const MessagesContext = createContext();

export function MessagesProvider({ userId, children }) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const lastPartOfUrlPath = pathname.split("/").pop();

  const fetchConversations = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/conversations",
      { params: { id: userId } }
    );
    if (response.status === 200) {
      return response.data.chats ? response.data.chats : [];
    } else {
      throw new Error("Error retrieving messeges");
    }
  };

  const conversationsQuery = useQuery({
    queryKey: ["conversations", userId],
    queryFn: fetchConversations,
    enabled: userId !== undefined,
  });

  const handleMessageNotificationSeen = async (userId) => {
    const response = await axios.post(
      "http://localhost:3000/users/message-notifications-seen",
      { params: userId }
    );
    if (response.status === 200) {
      return response.data.updatedConversations;
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", (message) => {
      console.log(`Message: ${message.content}, From: ${message.senderId}`);
      if (lastPartOfUrlPath === "messages") {
        handleMessageNotificationSeen(userId);
      }
      queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
    });
    return () => socket.off("receive-message");
  }, [lastPartOfUrlPath, queryClient, socket, userId]);

  return (
    <MessagesContext.Provider value={conversationsQuery}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}

MessagesProvider.propTypes = {
  userId: PropTypes.string,
  children: PropTypes.node,
};
