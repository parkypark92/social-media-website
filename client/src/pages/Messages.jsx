// import { useState, useRef } from "react";
// import socket from "../config/socket";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import styles from "./Messages.module.css";

export default function Messages() {
  const [newChat, setNewChat] = useState(false);
  const [currentChat, setCurrentChat] = useState({});
  const [allChats, setAllChats] = useState([]);

  const { user } = useOutletContext();
  useEffect(() => {
    const fetchConversations = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/conversations",
        { params: { id: user.id } }
      );
      if (response.data.chats.length) {
        setAllChats(response.data.chats);
        setCurrentChat(response.data.chats[0]);
      } else {
        setNewChat(true);
      }
    };
    fetchConversations();
  }, [user.id]);

  return (
    <div className={styles.pageCtnr}>
      <Chats
        setNewChat={setNewChat}
        currentChat={currentChat}
        allChats={allChats}
      ></Chats>
      <div className={styles.chatOffset}></div>
      <MessageBox
        newChat={newChat}
        setNewChat={setNewChat}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        allChats={allChats}
        setAllChats={setAllChats}
      ></MessageBox>
    </div>
  );
}
