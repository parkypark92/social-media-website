import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
import styles from "./FriendRequests.module.css";

export default function FriendRequests() {
  return (
    <div className={styles.container}>
      <FriendRequestsPreview></FriendRequestsPreview>
    </div>
  );
}
