import CreatePost from "../components/createPost/CreatePost";
import PostsFeed from "../components/posts/PostsFeed";
import RequestFriends from "../components/friends/RequestFriends";
import FriendsListPreview from "../components/friends/FriendsListPreview";
import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [postData, setPostData] = useState([]);

  return (
    <div className={styles.dashboardDisplay}>
      <div className={styles.feedDisplay}>
        <CreatePost postData={postData} setPostData={setPostData} />
        <PostsFeed postData={postData} setPostData={setPostData} />
      </div>
      <div className={styles.friendsDisplay}>
        <FriendsListPreview />
        <RequestFriends />
      </div>
    </div>
  );
}
