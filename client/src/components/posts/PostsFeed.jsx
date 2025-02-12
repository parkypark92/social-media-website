import Post from "./Post";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function PostsFeed({ postData, setPostData }) {
  const [feedError, setFeedError] = useState(null);

  const fetchPostData = useCallback(async () => {
    const response = await axios.get("http://localhost:3000/users/get-posts");
    if (response.status === 200) {
      setFeedError(null);
      setPostData(response.data.posts);
    } else {
      setFeedError(response.data.error);
    }
  }, [setPostData]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  return (
    <div>
      {feedError && <p>{feedError}</p>}
      {postData &&
        postData.map((post) => {
          return <Post key={post.text} postContent={post.text} />;
        })}
    </div>
  );
}

PostsFeed.propTypes = {
  postData: PropTypes.array,
  setPostData: PropTypes.func,
};
