import ProfilePicture from "../profilePicture/ProfilePicture";
import styles from "./FriendsListPreview.module.css";
import PropTypes from "prop-types";

export default function FriendsListPreview({ friendsList }) {
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

FriendsListPreview.propTypes = {
  friendsList: PropTypes.array,
};
