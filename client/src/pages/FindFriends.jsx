import RequestFriends from "../components/friends/RequestFriends";
import styles from "./FindFriends.module.css";

export default function FindFriends() {
  return (
    <div className={styles.container}>
      <RequestFriends></RequestFriends>
    </div>
  );
}
