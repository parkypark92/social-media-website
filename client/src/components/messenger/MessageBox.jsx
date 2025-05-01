import styles from "./MessageBox.module.css";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";

export default function MessageBox({ newChat, setNewChat }) {
  const { friendsList } = useOutletContext();

  return (
    <div className={styles.messenger}>
      <div className={styles.messengerHeader}>
        {newChat ? (
          <>
            <h3 style={{ margin: 0, marginRight: "auto" }}>
              Start a new chat!
            </h3>
            <button onClick={() => setNewChat(false)}>Cancel</button>
          </>
        ) : (
          <h3 style={{ margin: 0 }}>Messenger</h3>
        )}
      </div>
      {newChat ? (
        friendsList.map((friend) => {
          return (
            <div key={friend.id}>
              <p>{friend.username}</p>
            </div>
          );
        })
      ) : (
        <>
          <div className={styles.messengerContent}></div>
          <form>
            <div className={styles.formCtnr}>
              <input
                type="text"
                id="message"
                name="message"
                placeholder="Send a message..."
                className={styles.messageInput}
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
};
