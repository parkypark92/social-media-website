import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./MessageBubble.module.css";

export default function MessageBubble({ msg }) {
  const { user } = useOutletContext();
  return (
    <div
      className={`${styles.bubble} ${
        msg.senderId === user.id ? styles.ownMsg : styles.friendsMsg
      }`}
    >
      <p className={styles.content}>{msg.content}</p>
    </div>
  );
}

MessageBubble.propTypes = {
  msg: PropTypes.object,
};
