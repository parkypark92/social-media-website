import CreatePost from "../components/createPost/CreatePost";
import PostsFeed from "../components/posts/PostsFeed";
import FriendsListPreview from "../components/friends/FriendsListPreview";
import RequestFriends from "../components/friends/RequestFriends";
import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
import { useState } from "react";
// import axios from "axios";
import { useOutletContext } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [postData, setPostData] = useState([]);
  // const [friendsList, setFriendsList] = useState([]);
  const { friendsList } = useOutletContext();

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     const response = await axios.get(
  //       "http://localhost:3000/users/get-friends",
  //       { params: { id: user.id } }
  //     );
  //     if (response.status === 200) {
  //       const friends = response.data.friendsList.map((friendship) => {
  //         if (friendship.senderId === user.id) {
  //           return friendship.receiver;
  //         } else {
  //           return friendship.sender;
  //         }
  //       });
  //       setFriendsList(friends);
  //     } else {
  //       console.log("Error");
  //     }
  //   };
  //   fetchFriends();
  // }, [user.id]);

  return (
    <div className={styles.dashboardDisplay}>
      <div className={styles.menuDisplay}>
        <FriendsListPreview friendsList={friendsList}></FriendsListPreview>
      </div>
      <div className={styles.feedDisplay}>
        <CreatePost />
        <PostsFeed
          postData={postData}
          setPostData={setPostData}
          friendsList={friendsList}
        />
      </div>
      <div className={styles.friendsDisplay}>
        <h2>Friend Requests</h2>
        <FriendRequestsPreview limit={4} />
        <h2>Find some new friends!</h2>
        <RequestFriends limit={4} />
      </div>
    </div>
  );
}
