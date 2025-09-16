import { useNotifications } from "../../contexts/NotificationsProvider";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationsDisplay.module.css";
import PropTypes from "prop-types";

export default function NotificationsDisplay({ userId }) {
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Notifications</h3>
      {notifications && notifications.length > 0 ? (
        notifications.map((notification) => {
          const route =
            notification.type === "like" || notification.type === "comment"
              ? `/post/${notification.postId}`
              : notification.type === "friend-request"
              ? `/${userId}/friend-requests`
              : notification.type === "accepted-request"
              ? `/profile/${notification.senderId}`
              : "";
          return (
            <div
              key={notification.id}
              className={styles.notificationLink}
              onClick={() => navigate(route)}
            >
              {notification.message}
            </div>
          );
        })
      ) : (
        <p>No new notifications!</p>
      )}
    </div>
  );
}

NotificationsDisplay.propTypes = {
  userId: PropTypes.string,
};
