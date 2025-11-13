import { useState } from "react";
import RequestFriends from "../components/friends/RequestFriends";
import FriendRequestsPreview from "../components/friends/FriendRequestsPreview";
import FriendsListPreview from "../components/friends/FriendsListPreview";
import styles from "./Friends.module.css";

export default function Friends() {
  const [select, setSelect] = useState("all-friends");
  return (
    <>
      <div className={styles.selectButtons}>
        <button
          onClick={() => setSelect("all-friends")}
          className={`${styles.selectButton} ${
            select === "all-friends" ? styles.selected : ""
          }`}
        >
          All Friends
        </button>
        <button
          onClick={() => setSelect("friend-requests")}
          className={`${styles.selectButton} ${
            select === "friend-requests" ? styles.selected : ""
          }`}
        >
          Friend Requests
        </button>
        <button
          onClick={() => setSelect("find-friends")}
          className={`${styles.selectButton} ${
            select === "find-friends" ? styles.selected : ""
          }`}
        >
          Find Friends
        </button>
      </div>
      <div className={styles.offset}></div>

      {select === "all-friends" && <FriendsListPreview></FriendsListPreview>}
      {select === "friend-requests" && (
        <>
          <FriendRequestsPreview></FriendRequestsPreview>
        </>
      )}
      {select === "find-friends" && (
        <>
          <RequestFriends></RequestFriends>
        </>
      )}
    </>
  );
}
