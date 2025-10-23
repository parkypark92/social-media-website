import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Sidebar() {
  const { user } = useOutletContext();
  return (
    <ul className={styles.list}>
      <Link to="/" className={styles.menuLink}>
        <li className={styles.listItem}>Home</li>
      </Link>
      <Link to={`/profile/${user.id}`} className={styles.menuLink}>
        <li className={styles.listItem}>Profile</li>
      </Link>
      <Link to={`/${user.id}/saved`} className={styles.menuLink}>
        <li className={styles.listItem}>Saved</li>
      </Link>
      <Link to={`/${user.id}/friends`} className={styles.menuLink}>
        <li className={styles.listItem}>Friends</li>
      </Link>
      <Link to={`/${user.id}/messages`} className={styles.menuLink}>
        <li className={styles.listItem}>Messenger</li>
      </Link>
    </ul>
  );
}
