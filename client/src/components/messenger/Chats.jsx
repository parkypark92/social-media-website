import styles from "./Chats.module.css";
import PropTypes from "prop-types";

export default function Chats({ setNewChat }) {
  return (
    <div className={styles.chats}>
      <div className={styles.chatsHeader}>
        <h3 style={{ margin: 0 }}>Chats</h3>
        <button onClick={() => setNewChat(true)}>+</button>
      </div>
      <div className={styles.scroll}></div>
    </div>
  );
}

Chats.propTypes = {
  setNewChat: PropTypes.func,
};
