import NotificationsDisplay from "./NotificationsDisplay";
import { useNotifications } from "../../contexts/NotificationsProvider";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { data: notifications } = useNotifications();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setFriendsList([]);
    navigate("/login");
  };

  const handleSeenNotifications = async (userId) => {
    const response = await axios.post(
      "http://localhost:3000/users/seen-notifications",
      { params: userId }
    );
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
          <button
            className={styles.navIcon}
            onClick={() => {
              navigate(`${user.id}/messages`);
            }}
          >
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
