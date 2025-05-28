import Post from "./Post";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

export default function PostsFeed({ postData, setPostData }) {
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
      setPostData(postsQuery.data.posts);
    }
    if (postsQuery.isError) {
      setFeedError(postsQuery.error.message);
    }
  }, [
    postsQuery.data?.posts,
    postsQuery.error?.message,
    postsQuery.isError,
    postsQuery.isSuccess,
    setPostData,
  ]);

  if (postsQuery.isLoading) return <h2>Loading feed...</h2>;

  return (
    <div>
      {feedError && <h2>{feedError}</h2>}
      {postData &&
        postData.map((post) => {
          return (
            <Post
              key={post.id}
              postContent={post}
              setPostData={setPostData}
              postData={postData}
            />
          );
        })}
    </div>
  );
}

PostsFeed.propTypes = {
  postData: PropTypes.array,
  setPostData: PropTypes.func,
};
