import ProfilePicture from "../profilePicture/ProfilePicture";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "./MessageBubble.module.css";

export const MessageBubble = forwardRef(function MessageBubble(
  { msg, recipient },
  ref
) {
  const isRecipient = msg.senderId === recipient.id;
  return (
    <div
      className={`${styles.msgContainer} ${
        isRecipient ? styles.friendsMsg : styles.ownMsg
      }`}
    >
      {isRecipient && (
        <div className={styles.profilePic}>
          <ProfilePicture userId={recipient.id} size={24} />
        </div>
      )}
      <div
        className={`${styles.bubble} ${
          isRecipient ? styles.friendBubble : styles.ownBubble
        }`}
        ref={ref}
      >
        <p className={styles.content}>{msg.content}</p>
      </div>
    </div>
  );
});

MessageBubble.propTypes = {
  msg: PropTypes.object,
  recipient: PropTypes.object,
};
