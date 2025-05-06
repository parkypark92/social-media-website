import styles from "./Chats.module.css";
import PropTypes from "prop-types";

export default function Chats({ setNewChat, allChats }) {
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
              <p
                key={chat.id}
              >{`${chat.userA.username} + ${chat.userB.username}`}</p>
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
  // currentChat: PropTypes.object,
  allChats: PropTypes.array,
};
