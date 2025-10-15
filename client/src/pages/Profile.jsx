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
  const isOwnProfile = user.id === userId;

  const fetchUserData = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/profile-info`, {
      params: { userId },
    });
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

  if (profileQuery.isLoading) return <h2>Loading...</h2>;
  if (profileQuery.isError) return <h2>{profileQuery.error.message}</h2>;

  return (
    <div className={styles.profileContainer}>
      {profileQuery.data.profileInfo ? (
        isOwnProfile ? (
          <>
            <div className={styles.infoDisplay}>
              {profileQuery.data.profileInfo && (
                <ProfileHeader
                  profileInfo={profileQuery.data.profileInfo}
                  ownProfile={true}
                />
              )}
            </div>
            <div className={styles.postsDisplay}>
              <CreatePost />
              {profileQuery.data.profileInfo.posts.length > 0 ? (
                <ProfilePosts
                  profilePosts={profileQuery.data.profileInfo.posts}
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
              {profileQuery.data.profileInfo && (
                <ProfileHeader profileInfo={profileQuery.data.profileInfo} />
              )}
            </div>
            <div className={styles.postsDisplay}>
              {profileQuery.data.profileInfo.posts.length > 0 ? (
                <ProfilePosts
                  profilePosts={profileQuery.data.profileInfo.posts}
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
