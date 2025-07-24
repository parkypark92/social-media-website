import Post from "./Post";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function PostsFeed() {
  const [feedError, setFeedError] = useState(null);
  const { friendsList } = useOutletContext();
  const friendIds = friendsList.map((friend) => friend.id);

  const fetchPostData = async () => {
    const response = await axios.get("http://localhost:3000/users/get-posts", {
      params: { ids: friendIds },
    });
    if (response.data.posts) {
      return response.data;
    } else {
      throw new Error("Error loading posts feed");
    }
  };

  const postsQuery = useQuery({
    queryKey: ["posts", friendIds],
    queryFn: fetchPostData,
  });

  useEffect(() => {
    if (postsQuery.isSuccess) {
      setFeedError(null);
    }
    if (postsQuery.isError) {
      setFeedError(postsQuery.error.message);
    }
  }, [postsQuery.error?.message, postsQuery.isError, postsQuery.isSuccess]);

  if (postsQuery.isLoading) return <h2>Loading feed...</h2>;

  return (
    <div>
      {feedError && <h2>{feedError}</h2>}
      {postsQuery.data.posts.length > 0 ? (
        postsQuery.data.posts.map((post) => {
          return <Post key={post.id} postContent={post} feedPost={true} />;
        })
      ) : (
        <h2>No posts to display...</h2>
      )}
    </div>
  );
}
