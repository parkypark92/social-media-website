import ProfilePicture from "../profilePicture/ProfilePicture.jsx";
import { MessageBubble } from "./MessageBubble.jsx";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./MessageBox.module.css";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../contexts/SocketProvider.jsx";
import { useOnlineUsers } from "../../contexts/OnlineUsers.jsx";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";

export default function MessageBox({
  newChat,
  setNewChat,
  currentChat,
  setCurrentChat,
  allChats,
  setChatOpen,
  chatOpen,
}) {
  const { user, friendsList } = useOutletContext();
  const recipient =
    currentChat?.userA.id === user.id ? currentChat?.userB : currentChat?.userA;
  const [messageValue, setMessageValue] = useState("");
  const [newConversations, setNewConversations] = useState([]);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { onlineUsers } = useOnlineUsers();
  const setRef = useCallback(
    (node) => {
      if ((currentChat || chatOpen) && node) {
        node.scrollIntoView();
      }
    },
    [chatOpen, currentChat]
  );

  useEffect(() => {
    setNewConversations(
      friendsList.filter(
        (friend) =>
          !allChats.some(
            (chat) => chat.userAId === friend.id || chat.userBId === friend.id
          )
      )
    );
  }, [friendsList, allChats]);

  const createConversation = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(
      `${BASE_URL}/users/create-conversation`,
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  };

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
      setCurrentChat(data.conversation);
      setNewChat(false);
    },
  });

  const sendMessage = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/send-message`, data);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(response.data.error);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
      setMessageValue("");
      const message = data.message;
      const recipientId =
        data.conversation.userAId === user.id
          ? data.conversation.userBId
          : data.conversation.userAId;
      socket.emit("send-message", recipientId, message);
    },
  });

  const callSendMessageMutation = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      message: data.get("message"),
      conversationId: currentChat.id,
      senderId: user.id,
    };
    sendMessageMutation.mutate(formData);
  };

  const isSmallScreen = useMediaQuery({ maxWidth: 992 });

  return (
    <div className={styles.messenger}>
      <div className={styles.messengerHeader}>
        {newChat ? (
          <>
            <h3 style={{ margin: 0, marginRight: "auto" }}>
              Start a new chat!
            </h3>
            {allChats.length > 0 && (
              <button
                onClick={() => {
                  setNewChat(false);
                  setChatOpen(false);
                }}
              >
                Cancel
              </button>
            )}
          </>
        ) : currentChat ? (
          <>
            <ProfilePicture userId={recipient.id} size={40} link={false} />
            <h3>{recipient.username}</h3>
            {onlineUsers.includes(recipient.id) && (
              <small className={styles.online}>online</small>
            )}
            {isSmallScreen && (
              <button onClick={() => setChatOpen(false)}>Chats</button>
            )}
          </>
        ) : (
          <h3>Messenger</h3>
        )}
      </div>
      {newChat ? (
        <div className={styles.chatSelectCtnr}>
          {newConversations.length === 0 && (
            <p>You&apos;ll need to make some more friends to chat with!</p>
          )}
          {newConversations.map((friend) => {
            return (
              <div
                key={friend.id}
                className={styles.chatSelect}
                onClick={() =>
                  createConversationMutation.mutate({
                    userId: user.id,
                    friendId: friend.id,
                  })
                }
              >
                <div className={styles.avatar}>
                  <ProfilePicture userId={friend.id} link={false} />
                  <p>{friend.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className={styles.messengerContent}>
            {currentChat &&
              currentChat.messages.map((message, index) => {
                const lastMessage = currentChat.messages.length - 1 === index;
                return (
                  <MessageBubble
                    key={message.id}
                    msg={message}
                    recipient={recipient}
                    ref={lastMessage ? setRef : null}
                  ></MessageBubble>
                );
              })}
          </div>
          <form onSubmit={callSendMessageMutation}>
            <div className={styles.formCtnr}>
              <input
                type="text"
                id="message"
                name="message"
                placeholder="Send a message..."
                className={styles.messageInput}
                onChange={(e) => setMessageValue(e.target.value)}
                value={messageValue}
              />
              <button
                disabled={messageValue === "" ? true : false}
                className={
                  messageValue === "" ? styles.disabled : styles.sendMessage
                }
              >
                <img src="/post.png" alt="" height={24} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

MessageBox.propTypes = {
  newChat: PropTypes.bool,
  setNewChat: PropTypes.func,
  currentChat: PropTypes.object,
  setCurrentChat: PropTypes.func,
  allChats: PropTypes.array,
  setChatOpen: PropTypes.func,
  chatOpen: PropTypes.bool,
};
