import { useNotifications } from "../../contexts/NotificationsProvider";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationsDisplay.module.css";

export default function NotificationsDisplay() {
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => {
          const route =
            notification.type === "like" || notification.type === "comment"
              ? `/post/${notification.postId}`
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
