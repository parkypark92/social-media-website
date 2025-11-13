import CreatePost from "../components/createPost/CreatePost";
import PostsFeed from "../components/posts/PostsFeed";
import RequestFriends from "../components/friends/RequestFriends";
import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
import Sidebar from "../components/sidebar/Sidebar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboardDisplay}>
      <div className={styles.menuDisplay}>
        <div className={styles.sidebarFixed}>
          <Sidebar></Sidebar>
        </div>
      </div>
      <div className={styles.feedDisplay}>
        <CreatePost />
        <PostsFeed />
      </div>
      <div className={styles.friendsDisplay}>
        <div className={styles.friendsFixed}>
          <FriendRequestsPreview limit={4} />
          <RequestFriends limit={4} />
        </div>
      </div>
    </div>
  );
}
