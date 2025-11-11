import Post from "../components/posts/Post";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import styles from "./SavedPosts.module.css";
import shared from "../css/SharedStyle.module.css";

export default function SavedPosts() {
  const { user } = useOutletContext();
  const [savedPostsError, setSavedPostsError] = useState(null);
  const navigate = useNavigate();

  const fetchSavedPosts = async ({ pageParam = 1 }) => {
    const limit = 10;
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/get-saved-posts`, {
      params: { userId: user.id, page: pageParam, limit },
    });
    if (response.data.savedPosts) {
      return {
        posts: response.data.savedPosts,
        nextPage:
          response.data.savedPosts.length === limit ? pageParam + 1 : undefined,
      };
    } else {
      throw new Error("Error loading posts feed");
    }
  };

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["saved-posts", user.id],
    queryFn: fetchSavedPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (isSuccess) {
      setSavedPostsError(null);
    }
    if (isError) {
      setSavedPostsError(error.message);
    }
  }, [error?.message, isError, isSuccess]);

  if (isLoading) return <h2>Loading feed...</h2>;

  const savedPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className={styles.pageContainer}>
      {savedPostsError && <h2>{savedPostsError}</h2>}
      {savedPosts.length > 0 ? (
        <>
          {savedPosts.map((post) => {
            return <Post key={post.id} postContent={post} feedPost={true} />;
          })}
          {hasNextPage && (
            <button onClick={fetchNextPage} disabled={isFetching}>
              Load More
            </button>
          )}
        </>
      ) : (
        <h2>You have no saved posts...</h2>
      )}
      <button className={shared.backLink} onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
