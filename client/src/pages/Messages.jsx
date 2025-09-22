import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import { useMessages } from "../contexts/MessagesProvider";
import styles from "./Messages.module.css";

export default function Messages() {
  const { data: chats } = useMessages();
  const [newChat, setNewChat] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const updateNewMessageSeen = async (currentChat) => {
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
    if (chats) {
      if (chats.length === 0) {
        setNewChat(true);
      } else if (currentChat === null) {
        setCurrentChat(chats[0]);
      } else {
        const [updatedChat] = chats.filter(
          (chat) => chat.id === currentChat.id
        );
        setCurrentChat(updatedChat);
      }
    }
  }, [chats, currentChat]);

  return (
    <div className={styles.pageCtnr}>
      {chats && (
        <>
          <Chats
            setNewChat={setNewChat}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            allChats={chats}
          ></Chats>
          <div className={styles.chatOffset}></div>
          <MessageBox
            newChat={newChat}
            setNewChat={setNewChat}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            allChats={chats}
          ></MessageBox>
        </>
      )}
    </div>
  );
}
