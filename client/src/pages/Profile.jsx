import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

  const fetchUserPosts = async ({ pageParam = 1 }) => {
    const limit = 2;
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await axios.get(`${BASE_URL}/users/profile-posts`, {
      params: { userId, page: pageParam, limit },
    });
    if (response.data.profilePosts) {
      return {
        posts: response.data.profilePosts,
        nextPage:
          response.data.profilePosts.length === limit
            ? pageParam + 1
            : undefined,
      };
    }
  };

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchUserData,
  });

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["profile-posts", userId],
      queryFn: fetchUserPosts,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  if (profileQuery.isLoading) return <h2>Loading...</h2>;
  if (profileQuery.isError) return <h2>Error Loading Page</h2>;

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

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
              {allPosts.length > 0 ? (
                <ProfilePosts profilePosts={allPosts} />
              ) : isLoading ? (
                <h2>Loading Feed</h2>
              ) : isError ? (
                <h2>Error Loading Feed</h2>
              ) : (
                <h2>You have no posts yet...</h2>
              )}
              {allPosts.length > 0 && hasNextPage && (
                <button onClick={fetchNextPage} disabled={isFetching}>
                  Load More
                </button>
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
              {allPosts.length > 0 ? (
                <ProfilePosts profilePosts={allPosts} />
              ) : isLoading ? (
                <h2>Loading Feed</h2>
              ) : isError ? (
                <h2>Error Loading Feed</h2>
              ) : (
                <h2>You have no posts yet...</h2>
              )}
              {allPosts.length > 0 && hasNextPage && (
                <button onClick={fetchNextPage} disabled={isFetching}>
                  Load More
                </button>
              )}
            </div>
            <div className={styles.emptySpace}></div>
          </>
        )
      ) : (
        <h2>...Loading</h2>
      )}
    </div>
  );
}
