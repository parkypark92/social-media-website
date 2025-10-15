import NotificationsDisplay from "./NotificationsDisplay";
import { useNotifications } from "../../contexts/NotificationsProvider";
import { useMessages } from "../../contexts/MessagesProvider";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css";
import PropTypes from "prop-types";

export default function Navbar({
  user,
  setUser,
  setIsAuthenticated,
  setFriendsList,
  notificationsIsOpen,
  setNotificationsIsOpen,
}) {
  const { data: chats } = useMessages();
  const { data: notifications } = useNotifications();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split("/").pop();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setFriendsList([]);
    navigate("/login");
  };

  const handleSeenNotifications = async (userId) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/seen-notifications`, {
      params: userId,
    });
    if (response.status === 200) {
      return response.data.updatedNotifications;
    }
  };

  const seenNotificationsMutation = useMutation({
    mutationFn: handleSeenNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user.id]);
    },
  });

  const handleNotificationIconClick = () => {
    setNotificationsIsOpen(!notificationsIsOpen);
    if (notifications.some((n) => n.seen === false))
      seenNotificationsMutation.mutate(user.id);
  };

  const handleMessageNotificationSeen = async (userId) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(
      `${BASE_URL}/users/message-notifications-seen`,
      { params: userId }
    );
    if (response.status === 200) {
      return response.data.updatedConversations;
    }
  };

  const messageNotificationSeenMutation = useMutation({
    mutationFn: handleMessageNotificationSeen,
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations", user.id]);
    },
  });

  const handleMessageIconClick = () => {
    if (chats.some((c) => c.newMessageNotificationSeen === false))
      messageNotificationSeenMutation.mutate(user.id);
    navigate(`${user.id}/messages`);
  };

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>FineFellows</h2>
      {user && (
        <div className={styles.icons}>
          {notifications &&
          notifications.filter((n) => n.seen === false).length > 0 ? (
            <div className={styles.notificationsCount}>
              {notifications.filter((n) => n.seen === false).length}
            </div>
          ) : null}
          {path !== "messages" &&
          chats &&
          chats.filter(
            (c) =>
              c.newMessageNotificationSeen === false &&
              c.lastMessageSenderId !== user.id
          ).length > 0 ? (
            <div className={styles.newMessagesCount}>
              {
                chats.filter(
                  (c) =>
                    c.newMessageNotificationSeen === false &&
                    c.lastMessageSenderId !== user.id
                ).length
              }
            </div>
          ) : null}
          <button
            className={styles.navIcon}
            onClick={() => navigate(`/${user.id}`)}
          >
            <img src="/home.png" alt="" height={24} />
          </button>
          <div className={styles.vl}></div>
          <button
            className={`${styles.navIcon} ${styles.notificationsIcon}`}
            onClick={handleNotificationIconClick}
          >
            <img className={styles.image} src="/bell.png" alt="" height={26} />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon} onClick={handleMessageIconClick}>
            <img src="/message.png" alt="" height={24} />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon}>
            <img src="/logout.png" alt="" height={24} onClick={handleLogout} />
          </button>
        </div>
      )}
      {notificationsIsOpen && (
        <NotificationsDisplay userId={user.id}></NotificationsDisplay>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  setIsAuthenticated: PropTypes.func,
  setFriendsList: PropTypes.func,
  notificationsIsOpen: PropTypes.bool,
  setNotificationsIsOpen: PropTypes.func,
};
