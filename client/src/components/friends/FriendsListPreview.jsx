import PropTypes from "prop-types";

export default function FriendsListPreview({ friendsList }) {
  return (
    <div>
      <h2>Friends</h2>
      {friendsList.length ? (
        <ul>
          {friendsList.map((friend) => {
            return <li key={friend.id}>{friend.username}</li>;
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
