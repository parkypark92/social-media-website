// import { useState, useRef } from "react";
// import socket from "../config/socket";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import styles from "./Messages.module.css";

export default function Messages() {
  const [newChat, setNewChat] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  // const [allChats, setAllChats] = useState([]);

  const { user } = useOutletContext();

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

  useEffect(() => {
    if (conversationsQuery.isSuccess) {
      if (conversationsQuery.data.chats.length > 0) {
        // setAllChats(conversationsQuery.data.chats);
        setCurrentChat(conversationsQuery.data.chats[0]);
      } else {
        setNewChat(true);
      }
    }
  }, [conversationsQuery.data?.chats, conversationsQuery.isSuccess]);

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
        // setAllChats={setAllChats}
      ></MessageBox>
    </div>
  );
}
