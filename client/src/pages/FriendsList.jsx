import FriendsListPreview from "../components/friends/FriendsListPreview";
import styles from "./FriendsList.module.css";

export default function FriendsList() {
  return (
    <div className={styles.container}>
      <FriendsListPreview></FriendsListPreview>;
    </div>
  );
}
