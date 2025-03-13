import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function FriendsListPreview() {
  const [friendsPreview, setFriendsPreview] = useState([]);
  const { user } = useOutletContext();
  useEffect(() => {
    const fetchFriends = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/get-friends",
        { params: { id: user.id } }
      );
      if (response.status === 200) {
        const friends = response.data.friendsList.map((friendship) => {
          if (friendship.senderId === user.id) {
            return friendship.receiver;
          } else {
            return friendship.sender;
          }
        });
        setFriendsPreview(friends);
      } else {
        console.log("Error");
      }
    };
    fetchFriends();
  }, [user.id]);
  return (
    <div>
      <h2>Friends</h2>
      {friendsPreview.length ? (
        <ul>
          {friendsPreview.map((friend) => {
            return <li key={friend.id}>{friend.username}</li>;
          })}
        </ul>
      ) : (
        <p>You are a lone wolf...</p>
      )}
    </div>
  );
}
