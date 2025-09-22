import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import styles from "./Messages.module.css";

export default function Messages() {
  const [newChat, setNewChat] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const fetchConversations = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/conversations",
      { params: { id: user.id } }
    );
    if (response.status === 200) {
      return response.data.chats ? response.data : [];
    } else {
      throw new Error("Error retrieving messeges");
    }
  };

  const conversationsQuery = useQuery({
    queryKey: ["conversations", user.id],
    queryFn: fetchConversations,
  });

  const updateNewMessageSeen = async (currentChat) => {
    console.log(currentChat);
    const response = await axios.post(
      "http://localhost:3000/users/message-seen",
      { currentChat }
    );
    if (response.status === 200) {
      return response.data.updatedChat;
    }
  };

  const messageSeenMutation = useMutation({
    mutationFn: updateNewMessageSeen,
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations", user.id]);
    },
  });

  useEffect(() => {
    if (
      currentChat?.lastMessageSeen === false &&
      currentChat?.lastMessageSenderId !== user.id
    ) {
      messageSeenMutation.mutate(currentChat);
    }
  }, [currentChat]);

  useEffect(() => {
    if (conversationsQuery.isSuccess) {
      if (conversationsQuery.data.chats.length === 0) {
        setNewChat(true);
      } else if (currentChat === null) {
        setCurrentChat(conversationsQuery.data.chats[0]);
      } else {
        const [updatedChat] = conversationsQuery.data.chats.filter(
          (chat) => chat.id === currentChat.id
        );
        setCurrentChat(updatedChat);
      }
    }
  }, [
    conversationsQuery.data?.chats,
    conversationsQuery.isSuccess,
    currentChat,
  ]);

  if (conversationsQuery.isLoading) return <h2>Loading...</h2>;
  if (conversationsQuery.isError)
    return <h2>{conversationsQuery.error.message}</h2>;

  return (
    <div className={styles.pageCtnr}>
      <Chats
        setNewChat={setNewChat}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        allChats={conversationsQuery.data.chats}
      ></Chats>
      <div className={styles.chatOffset}></div>
      <MessageBox
        newChat={newChat}
        setNewChat={setNewChat}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        allChats={conversationsQuery.data.chats}
      ></MessageBox>
    </div>
  );
}
