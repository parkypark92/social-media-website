import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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
  const isOwnProfile = user.id === userId;

  const fetchUserData = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/profile-info",
      {
        params: { userId },
      }
    );
    if (response.data.profileInfo) {
      return response.data;
    } else {
      throw new Error("An error occurred");
    }
  };

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchUserData,
  });

  useEffect(() => {
    if (profileQuery.isSuccess) {
      setProfileInfo(profileQuery.data.profileInfo);
      setProfilePosts(profileQuery.data.profileInfo.posts);
    }
  }, [profileQuery.data?.profileInfo, profileQuery.isSuccess]);

  if (profileQuery.isLoading) return <h2>Loading...</h2>;
  if (profileQuery.isError) return <h2>{profileQuery.error.message}</h2>;

  return (
    <div className={styles.profileContainer}>
      {profileInfo ? (
        isOwnProfile ? (
          <>
            <div className={styles.infoDisplay}>
              {profileInfo && <ProfileHeader profileInfo={profileInfo} />}
            </div>
            <div className={styles.postsDisplay}>
              <CreatePost />
              {profilePosts.length > 0 ? (
                <ProfilePosts
                  profilePosts={profilePosts}
                  setProfilePosts={setProfilePosts}
                />
              ) : (
                <h2>You have no posts yet...</h2>
              )}
            </div>
            <div className={styles.friendsDisplay}>
              <FriendsListPreview />
            </div>
          </>
        ) : (
          <>
            <div className={styles.infoDisplay}>
              {profileInfo && <ProfileHeader profileInfo={profileInfo} />}
            </div>
            <div className={styles.postsDisplay}>
              {profilePosts.length > 0 ? (
                <ProfilePosts
                  profilePosts={profilePosts}
                  setProfilePosts={setProfilePosts}
                />
              ) : (
                <h2>User has no posts yet...</h2>
              )}
            </div>
          </>
        )
      ) : (
        <h2>...Loading</h2>
      )}
    </div>
  );
}
