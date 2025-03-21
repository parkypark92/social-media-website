import Post from "./Post";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function PostsFeed({ postData, setPostData, friendsList }) {
  const [feedError, setFeedError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      const friendIds = friendsList.map((friend) => friend.id);
      const response = await axios.get(
        "http://localhost:3000/users/get-posts",
        { params: { ids: friendIds } }
      );
      if (response.status === 200) {
        setFeedError(null);
        setPostData(response.data.posts);
      } else {
        setFeedError(response.data.error);
      }
    };
    friendsList.length && fetchPostData();
  }, [friendsList, setPostData]);

  return (
    <div>
      {feedError && <p>{feedError}</p>}
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
  friendsList: PropTypes.array,
};
