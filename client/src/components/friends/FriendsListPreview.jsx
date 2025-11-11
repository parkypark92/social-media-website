import ProfilePicture from "../profilePicture/ProfilePicture";
import { useOutletContext } from "react-router-dom";
import { useOnlineUsers } from "../../contexts/OnlineUsers";
import { useNavigate, Link } from "react-router-dom";
import styles from "./FriendsListPreview.module.css";
import shared from "../../css/SharedStyle.module.css";
import PropTypes from "prop-types";

export default function FriendsListPreview({ limit }) {
  const { user, friendsList } = useOutletContext();
  const { onlineUsers } = useOnlineUsers();
  const navigate = useNavigate();
  let friendsToMap = limit ? friendsList.slice(0, limit) : friendsList;
  return (
    <div>
      <h2>Friends</h2>
      {friendsToMap.length ? (
        <ul>
          {friendsToMap.map((friend) => {
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
      {limit && friendsToMap.length > 0 ? (
        <Link to={`/${user?.id}/friends-list`}>View all</Link>
      ) : !limit ? (
        <button className={shared.backLink} onClick={() => navigate(-1)}>
          Back
        </button>
      ) : undefined}
    </div>
  );
}

FriendsListPreview.propTypes = {
  limit: PropTypes.number,
};
