import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PropTypes from "prop-types";

const MessagesContext = createContext();

export function MessagesProvider({ userId, children }) {
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
