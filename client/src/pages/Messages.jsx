import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useMessages } from "../contexts/MessagesProvider";
import { useMediaQuery } from "react-responsive";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import styles from "./Messages.module.css";

export default function Messages() {
  const { data: chats } = useMessages();
  const [newChat, setNewChat] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const updateNewMessageSeen = async (currentChat) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/message-seen`, {
      currentChat,
    });
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

  const deleteEmptyChats = async (chats) => {
    const chatsToDelete = chats
      .filter((chat) => chat.messages.length === 0)
      .map((chat) => chat.id);
    if (chatsToDelete.length === 0) return;
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await axios.post(
      `${BASE_URL}/users/delete-empty-conversations`,
      { userId: user.id, chatsToDelete }
    );
    if (response.status === 200) {
      const updatedCurrentChat = chats.find(
        (chat) => chat.messages.length !== 0
      );
      setCurrentChat(updatedCurrentChat);
    }
    if (response.status !== 200) {
      throw new Error("Error deleting chats");
    }
  };

  const deleteEmptyChatsMutation = useMutation({
    mutationFn: deleteEmptyChats,
    onSuccess: () => {
      console.log("deleted");
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
    },
  });

  useEffect(() => {
    deleteEmptyChatsMutation.mutate(chats);
  }, []);

  useEffect(() => {
    if (
      currentChat?.lastMessageSeen === false &&
      currentChat?.lastMessageSenderId !== user.id
    ) {
      messageSeenMutation.mutate(currentChat);
      setNewChat(false);
    }
  }, [currentChat, messageSeenMutation, user.id]);

  useEffect(() => {
    if (chats) {
      if (chats.length === 0) {
        console.log(1);
        setNewChat(true);
        setChatOpen(true);
      } else if (chats.length > 0) {
        setNewChat(false);
      }
      if (chats.some((chat) => chat.id === currentChat?.id)) {
        const [updatedChat] = chats.filter(
          (chat) => chat.id === currentChat?.id
        );
        setCurrentChat(updatedChat);
      }
      if (currentChat === null) {
        setCurrentChat(chats[0]);
      }
    }
  }, [chats, currentChat]);

  const isSmallScreen = useMediaQuery({ maxWidth: 992 });

  return (
    <>
      {isSmallScreen ? (
        <>
          {chats && (
            <>
              <div
                className={`${chats.length === 0 ? styles.hidden : ""} ${
                  chatOpen ? styles.hidden : ""
                }`}
              >
                <Chats
                  setNewChat={setNewChat}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                  allChats={chats}
                  setChatOpen={setChatOpen}
                ></Chats>
              </div>
              <div className={`${!chatOpen ? styles.hidden : ""}`}>
                <MessageBox
                  newChat={newChat}
                  setNewChat={setNewChat}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat}
                  allChats={chats}
                  setChatOpen={setChatOpen}
                ></MessageBox>
              </div>
            </>
          )}
        </>
      ) : (
        <div className={styles.pageCtnr}>
          {chats && (
            <>
              <Chats
                setNewChat={setNewChat}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                allChats={chats}
                setChatOpen={setChatOpen}
              ></Chats>
              <div className={styles.chatOffset}></div>
              <MessageBox
                newChat={newChat}
                setNewChat={setNewChat}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                allChats={chats}
                setChatOpen={setChatOpen}
              ></MessageBox>
            </>
          )}
        </div>
      )}
    </>
  );
}
