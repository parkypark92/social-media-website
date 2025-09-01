import ProfilePicture from "../profilePicture/ProfilePicture";
import { useOutletContext } from "react-router-dom";
import { useOnlineUsers } from "../../contexts/OnlineUsers";
import styles from "./FriendsListPreview.module.css";

export default function FriendsListPreview() {
  const { friendsList } = useOutletContext();
  const { onlineUsers } = useOnlineUsers();
  return (
    <div>
      <h2>Friends</h2>
      {friendsList.length ? (
        <ul>
          {friendsList.map((friend) => {
            return (
              <div className={styles.container} key={friend.id}>
                <div className={styles.avatar}>
                  <ProfilePicture userId={friend.id} />
                  <li>{friend.username}</li>
                  {onlineUsers.includes(friend.id) && (
                    <small className={styles.online}>online</small>
                  )}
                </div>
              </div>
            );
          })}
        </ul>
      ) : (
        <p>You are a lone wolf...</p>
      )}
    </div>
  );
}
