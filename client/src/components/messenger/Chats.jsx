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
        <button onClick={() => setNewChat(true)}>+</button>
      </div>
      <div className={styles.scroll}>
        {allChats.length > 0 ? (
          allChats.map((chat) => {
            return (
              <div
                key={chat.id}
                className={styles.selectChat}
                onClick={() => {
                  setCurrentChat(chat);
                  setNewChat(false);
                }}
                style={{ backgroundColor: currentChat == chat && "#7777ff" }}
              >
                <ProfilePicture
                  link={false}
                  userId={
                    user.id === chat.userA.id ? chat.userB.id : chat.userA.id
                  }
                />
                <p>
                  {user.id === chat.userA.id
                    ? chat.userB.username
                    : chat.userA.username}
                </p>
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
