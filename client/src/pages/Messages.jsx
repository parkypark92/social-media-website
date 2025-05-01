// import { useState, useRef } from "react";
// import socket from "../config/socket";
import { useState } from "react";
import Chats from "../components/messenger/Chats";
import MessageBox from "../components/messenger/MessageBox";
import styles from "./Messages.module.css";

export default function Messages() {
  // const [messages, setMessages] = useState([]);
  // const inputRef = useRef();
  // socket.on("recieveMessage", (data) => {
  //   setMessages([...messages, data]);
  // });
  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   if (inputRef.current.value) {
  //     const msg = inputRef.current.value;
  //     socket.emit("sendMessage", msg);
  //     inputRef.current.value = "";
  //   }
  // };

  const [newChat, setNewChat] = useState(false);

  return (
    <div className={styles.pageCtnr}>
      <Chats setNewChat={setNewChat}></Chats>
      <div className={styles.chatOffset}></div>
      <MessageBox newChat={newChat} setNewChat={setNewChat}></MessageBox>
    </div>
  );
}
