import { useEffect } from "react";
import styles from "./PopupNotification.module.css";
import PropTypes from "prop-types";

export default function PopupNotification({
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.msgPosition}>
      <div className={styles.msgContainer}>{message}</div>
    </div>
  );
}

PopupNotification.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number,
};
