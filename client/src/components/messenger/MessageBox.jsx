import ProfilePicture from "../profilePicture/ProfilePicture.jsx";
import { useState, useEffect } from "react";
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
  setAllChats,
}) {
  const { user, friendsList } = useOutletContext();
  const [messageValue, setMessageValue] = useState("");

  const [newConversations, setNewConversations] = useState([]);
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

  const createConversation = async (friendId) => {
    const response = await axios.post(
      "http://localhost:3000/users/create-conversation",
      { userId: user.id, friendId: friendId }
    );
    if (response.status === 200) {
      setAllChats([response.data.conversation, ...allChats]);
      setCurrentChat(response.data.conversation);
      setNewChat(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      message: data.get("message"),
      conversationId: currentChat.id,
      senderId: user.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/send-message",
      formData
    );
    if (response.status === 200) {
      const updatedChats = allChats.map((chat) => {
        if (chat.id === currentChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, response.data.message],
            lastMessageAt: response.data.conversation.lastMessageAt,
          };
        } else {
          return chat;
        }
      });
      const sortedChats = updatedChats.sort((a, b) =>
        a.lastMessageAt > b.lastMessageAt
          ? -1
          : b.lastMessageAt > a.lastMessageAt
          ? 1
          : 0
      );
      setAllChats(sortedChats);
      setCurrentChat(sortedChats[0]);
      setMessageValue("");
    } else {
      console.log(response.data.error);
    }
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
                onClick={() => createConversation(friend.id)}
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
                  <p
                    key={message.id}
                  >{`${message.sender.username}: ${message.content}`}</p>
                );
              })}
          </div>
          <form onSubmit={sendMessage}>
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
  setAllChats: PropTypes.func,
};
