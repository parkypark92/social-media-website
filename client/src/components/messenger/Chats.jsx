import styles from "./Chats.module.css";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import ProfilePicture from "../profilePicture/ProfilePicture";

export default function Chats({
  setNewChat,
  allChats,
  currentChat,
  setCurrentChat,
}) {
  const { user } = useOutletContext();
  return (
    <div className={styles.chats}>
      <div className={styles.chatsHeader}>
        <h3 style={{ margin: 0 }}>Chats</h3>
        <button className={styles.newChat} onClick={() => setNewChat(true)}>
          <img src="/write.png" alt="" height={32} />
        </button>
      </div>
      <div className={styles.scroll}>
        {allChats.length > 0 ? (
          allChats.map((chat) => {
            const recipient =
              user.id === chat.userA.id ? chat.userB : chat.userA;

            return (
              <div
                key={chat.id}
                className={styles.selectChat}
                onClick={() => {
                  setCurrentChat(chat);
                  setNewChat(false);
                }}
                style={{ backgroundColor: currentChat == chat && "#ebf5ff" }}
              >
                <ProfilePicture link={false} userId={recipient.id} />
                <p>{recipient.username}</p>
                {chat.lastMessageSeen === false &&
                  chat.lastMessageSenderId !== user.id && (
                    <small>New message!</small>
                  )}
              </div>
            );
          })
        ) : (
          <p>No chats...</p>
        )}
      </div>
    </div>
  );
}

Chats.propTypes = {
  setNewChat: PropTypes.func,
  setCurrentChat: PropTypes.func,
  allChats: PropTypes.array,
  currentChat: PropTypes.object,
};
