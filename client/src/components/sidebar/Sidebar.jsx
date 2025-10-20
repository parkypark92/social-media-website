import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <ul className={styles.list}>
      <li className={styles.listItem}>Explore</li>
      <li className={styles.listItem}>Profile</li>
      <li className={styles.listItem}>Saved</li>
      <li className={styles.listItem}>Friends</li>
      <li className={styles.listItem}>Messenger</li>
    </ul>
  );
}
