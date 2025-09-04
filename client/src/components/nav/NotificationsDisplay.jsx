import { useNotifications } from "../../contexts/NotificationsProvider";
import styles from "./NotificationsDisplay.module.css";

export default function NotificationsDisplay() {
  const { notifications } = useNotifications();
  console.log(notifications);
  return (
    <div className={styles.container}>
      {notifications.length > 0 ? (
        notifications.map((notification) => {
          return (
            <div key={notification.id}>
              <p>{notification.message}</p>
            </div>
          );
        })
      ) : (
        <p>No new notifications!</p>
      )}
    </div>
  );
}
