import styles from "./Navbar.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  return (
    <nav className={styles.navbar}>
      <h2>FineFellows</h2>
      {user && (
        <div className={styles.userNav}>
          <p>Greetings, {user.username}!</p>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};
