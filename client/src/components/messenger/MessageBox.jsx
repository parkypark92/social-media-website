import ProfilePicture from "../profilePicture/ProfilePicture.jsx";
import MessageBubble from "./MessageBubble.jsx";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./MessageBox.module.css";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

export default function MessageBox({
  newChat,
  setNewChat,
  currentChat,
  setCurrentChat,
  allChats,
}) {
  const { user, friendsList } = useOutletContext();
  const [messageValue, setMessageValue] = useState("");
  const [newConversations, setNewConversations] = useState([]);
  const queryClient = useQueryClient();

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
    const response = await axios.post(
      "http://localhost:3000/users/create-conversation",
      data
    );
    if (response.status === 200) {
      return response.data;
    }
  };

  const sendMessage = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/send-message",
      data
    );
    if (response.status === 200) {
      return response.data;
      // const updatedChats = allChats.map((chat) => {
      //   if (chat.id === currentChat.id) {
      //     return {
      //       ...chat,
      //       messages: [...chat.messages, response.data.message],
      //       lastMessageAt: response.data.conversation.lastMessageAt,
      //     };
      //   } else {
      //     return chat;
      //   }
      // });
      // const sortedChats = updatedChats.sort((a, b) =>
      //   a.lastMessageAt > b.lastMessageAt
      //     ? -1
      //     : b.lastMessageAt > a.lastMessageAt
      //     ? 1
      //     : 0
      // );
      // setAllChats(sortedChats);
      // setCurrentChat(sortedChats[0]);
      // setMessageValue("");
    } else {
      console.log(response.data.error);
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

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.setQueryData(["conversations", user.id], (oldData) => {
        return {
          chats: oldData.chats.map((chat) => {
            if (chat.id === data.conversation.id) {
              return {
                ...chat,
                messages: [...chat.messages, data.message],
                lastMessageAt: data.conversation.lastMessageAt,
              };
            } else {
              return chat;
            }
          }),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
      setCurrentChat(data.message.lastMessageAt);
      setMessageValue("");
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

  return (
    <div className={styles.messenger}>
      <div className={styles.messengerHeader}>
        {newChat ? (
          <>
            <h3 style={{ margin: 0, marginRight: "auto" }}>
              Start a new chat!
            </h3>
            {allChats.length > 0 && (
              <button onClick={() => setNewChat(false)}>Cancel</button>
            )}
          </>
        ) : currentChat ? (
          <h3 style={{ margin: 0, marginRight: "auto" }}>
            {currentChat.userA.id === user.id
              ? currentChat.userB.username
              : currentChat.userA.username}
          </h3>
        ) : (
          <h3 style={{ margin: 0, marginRight: "auto" }}>Messenger</h3>
        )}
      </div>
      {newChat ? (
        <div className={styles.chatSelectCtnr}>
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
              currentChat.messages.map((message) => {
                return (
                  <MessageBubble key={message.id} msg={message}></MessageBubble>
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
              <button>Send</button>
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
};
