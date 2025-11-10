import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Sidebar() {
  const { user } = useOutletContext();
  return (
    <ul className={styles.list}>
      <Link to="/" className={styles.menuLink}>
        <div className={styles.menuItem}>
          <img src="/home-black.png" alt="" height={20} />
          <li className={styles.listItem}>Home</li>
        </div>
      </Link>
      <Link to={`/profile/${user.id}`} className={styles.menuLink}>
        <div className={styles.menuItem}>
          <img src="/profile.png" alt="" height={20} />
          <li className={styles.listItem}>Profile</li>
        </div>
      </Link>
      <Link to={`/${user.id}/saved`} className={styles.menuLink}>
        <div className={styles.menuItem}>
          <img src="/unsave.png" alt="" height={20} />
          <li className={styles.listItem}>Saved</li>
        </div>
      </Link>
      <Link to={`/${user.id}/friends`} className={styles.menuLink}>
        <div className={styles.menuItem}>
          <img src="/friends.png" alt="" height={20} />
          <li className={styles.listItem}>Friends</li>
        </div>
      </Link>
      <Link to={`/${user.id}/messages`} className={styles.menuLink}>
        <div className={styles.menuItem}>
          <img src="/message-black.png" alt="" height={20} />
          <li className={styles.listItem}>Messenger</li>
        </div>
      </Link>
    </ul>
  );
}
