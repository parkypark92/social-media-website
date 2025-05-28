import styles from "./Navbar.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  user,
  setUser,
  setIsAuthenticated,
  setFriendsList,
}) {
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
          <button className={styles.navIcon}>
            <img
              src="/home.png"
              alt=""
              height={24}
              onClick={() => navigate(`/${user.id}`)}
            />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon}>
            <img
              src="/message.png"
              alt=""
              height={24}
              onClick={() => navigate(`${user.id}/messages`)}
            />
          </button>
          <div className={styles.vl}></div>
          <button className={styles.navIcon}>
            <img src="/logout.png" alt="" height={24} onClick={handleLogout} />
          </button>
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
};
