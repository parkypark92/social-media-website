import NotificationsDisplay from "./NotificationsDisplay";
import { useNotifications } from "../../contexts/NotificationsProvider";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setFriendsList([]);
    navigate("/login");
  };
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>FineFellows</h2>
      {user && (
        <div className={styles.icons}>
          {notifications && (
            <div className={styles.notifications}>{notifications.length}</div>
          )}
          <button
            className={styles.navIcon}
            onClick={() => navigate(`/${user.id}`)}
          >
            <img src="/home.png" alt="" height={24} />
          </button>
          <div className={styles.vl}></div>
          <button
            className={`${styles.navIcon} ${styles.notificationsIcon}`}
            onClick={() => setNotificationsIsOpen(!notificationsIsOpen)}
          >
            <img className={styles.image} src="/bell.png" alt="" height={26} />
          </button>
          <div className={styles.vl}></div>
          <button
            className={styles.navIcon}
            onClick={() => navigate(`${user}/messages`)}
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
