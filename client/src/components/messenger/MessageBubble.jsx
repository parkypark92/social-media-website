import { forwardRef } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./MessageBubble.module.css";

export const MessageBubble = forwardRef(function MessageBubble({ msg }, ref) {
  const { user } = useOutletContext();
  return (
    <div
      className={`${styles.bubble} ${
        msg.senderId === user.id ? styles.ownMsg : styles.friendsMsg
      }`}
      ref={ref}
    >
      <p className={styles.content}>{msg.content}</p>
    </div>
  );
});

MessageBubble.propTypes = {
  msg: PropTypes.object,
};
