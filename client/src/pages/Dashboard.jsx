import CreatePost from "../components/createPost/CreatePost";
import PostsFeed from "../components/posts/PostsFeed";
// import FriendsListPreview from "../components/friends/FriendsListPreview";
import RequestFriends from "../components/friends/RequestFriends";
import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
import Sidebar from "../components/sidebar/Sidebar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboardDisplay}>
      <div className={styles.menuDisplay}>
        <Sidebar></Sidebar>
      </div>
      <div className={styles.feedDisplay}>
        <CreatePost />
        <PostsFeed />
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
