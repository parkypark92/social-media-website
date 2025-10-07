import Post from "./Post";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function PostsFeed() {
  const [feedError, setFeedError] = useState(null);
  const { friendsList } = useOutletContext();
  const friendIds = friendsList.map((friend) => friend.id);

  const fetchPostData = async ({ pageParam = 1 }) => {
    const limit = 10;
    const response = await axios.get("http://localhost:3000/users/get-posts", {
      params: { ids: friendIds, page: pageParam, limit },
    });
    if (response.data.posts) {
      return {
        posts: response.data.posts,
        nextPage:
          response.data.posts.length === limit ? pageParam + 1 : undefined,
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
    queryKey: ["posts", friendIds],
    queryFn: fetchPostData,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: friendIds.length > 0,
  });

  useEffect(() => {
    if (isSuccess) {
      setFeedError(null);
    }
    if (isError) {
      setFeedError(error.message);
    }
  }, [error?.message, isError, isSuccess]);

  if (isLoading) return <h2>Loading feed...</h2>;

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div>
      {feedError && <h2>{feedError}</h2>}
      {allPosts.length > 0 ? (
        <>
          {allPosts.map((post) => {
            return <Post key={post.id} postContent={post} feedPost={true} />;
          })}
          {hasNextPage && (
            <button onClick={fetchNextPage} disabled={isFetching}>
              Load More
            </button>
          )}
        </>
      ) : (
        <h2>No posts to display...</h2>
      )}
    </div>
  );
}
