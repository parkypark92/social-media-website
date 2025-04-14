import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ProfileHeader from "../components/profileHeader/ProfileHeader";
import CreatePost from "../components/createPost/CreatePost";
import ProfilePosts from "../components/posts/ProfilePosts";
import FriendsListPreview from "../components/friends/FriendsListPreview";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user } = useOutletContext();
  const { userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const [profilePosts, setProfilePosts] = useState(null);
  const [profileFriends, setProfileFriends] = useState(null);
  const isOwnProfile = user.id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/profile-info",
        {
          params: { userId },
        }
      );
      if (response.status === 200) {
        setProfileInfo(response.data.profileInfo);
        setProfilePosts(response.data.profileInfo.posts);
      } else {
        console.log("Error");
      }
    };

    const fetchFriends = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/get-friends",
        { params: { id: userId } }
      );
      if (response.status === 200) {
        const friends = response.data.friendsList.map((friendship) => {
          if (friendship.senderId === userId) {
            return friendship.receiver;
          } else {
            return friendship.sender;
          }
        });
        console.log(friends);
        setProfileFriends(friends);
      } else {
        console.log("Error");
      }
    };
    fetchUserData();
    fetchFriends();
  }, [userId]);

  return (
    <div className={styles.profileContainer}>
      {isOwnProfile ? (
        <>
          <div className={styles.infoDisplay}>
            {profileInfo && <ProfileHeader profileInfo={profileInfo} />}
          </div>
          <div className={styles.postsDisplay}>
            <CreatePost />
            {profilePosts && (
              <ProfilePosts
                profilePosts={profilePosts}
                setProfilePosts={setProfilePosts}
              />
            )}
          </div>
          <div className={styles.friendsDisplay}>
            {profileFriends && (
              <FriendsListPreview friendsList={profileFriends} />
            )}
          </div>
        </>
      ) : profileInfo ? (
        <>
          <div className={styles.infoDisplay}>
            {profileInfo && <ProfileHeader profileInfo={profileInfo} />}
          </div>
          <div className={styles.postsDisplay}>
            {profilePosts && (
              <ProfilePosts
                profilePosts={profilePosts}
                setProfilePosts={setProfilePosts}
              />
            )}
          </div>
        </>
      ) : (
        <h2>...Loading</h2>
      )}
    </div>
  );
}
