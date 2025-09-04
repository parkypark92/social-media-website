import NotificationsDisplay from "./NotificationsDisplay";
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
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setFriendsList([]);
    navigate("/login");
  };
  console.log(notificationsIsOpen);
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>FineFellows</h2>
      {user && (
        <div className={styles.icons}>
          <button className={styles.navIcon}>
            <img
              src="/home.png"
              alt=""
              height={24}
              onClick={() => navigate(`/${user.id}`)}
            />
          </button>
          <div className={styles.vl}></div>
          <button className={`${styles.navIcon} ${styles.notificationsIcon}`}>
            <img
              src="/bell.png"
              alt=""
              height={26}
              onClick={() => setNotificationsIsOpen(!notificationsIsOpen)}
            />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon}>
            <img
              src="/message.png"
              alt=""
              height={24}
              onClick={() => navigate(`${user}/messages`)}
            />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon}>
            <img src="/logout.png" alt="" height={24} onClick={handleLogout} />
          </button>
          {notificationsIsOpen && <NotificationsDisplay></NotificationsDisplay>}
        </div>
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
