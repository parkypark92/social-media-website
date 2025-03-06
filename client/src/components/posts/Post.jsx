import PropTypes from "prop-types";
import styles from "./Post.module.css";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Post({ postContent, setPostData, postData }) {
  const { user } = useOutletContext();
  console.log(postContent);

  const handleLikePost = async (e) => {
    e.preventDefault();
    const body = {
      postId: postContent.id,
      userId: user.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/like-post",
      body
    );
    if (response.status === 200) {
      console.log(response.data);
      setPostData(
        postData.map((prev) => {
          if (prev.id === postContent.id) {
            return {
              ...prev,
              likes: [...prev.likes, user],
            };
          } else {
            return prev;
          }
        })
      );
    } else {
      console.log("Error");
    }
  };

  const handleUnlikePost = async (e) => {
    e.preventDefault;
    e.preventDefault();
    const body = {
      postId: postContent.id,
      userId: user.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/unlike-post",
      body
    );
    if (response.status === 200) {
      console.log(response.data);
      setPostData(
        postData.map((prev) => {
          if (prev.id === postContent.id) {
            return {
              ...prev,
              likes: prev.likes.filter((e) => e.id !== user.id),
            };
          } else {
            return prev;
          }
        })
      );
    } else {
      console.log("Error");
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.authorAndDate}>
        <h3 style={{ margin: 0 }}>{postContent.author.username}</h3>
        <small>{format(parseISO(postContent.postedAt), "MMMM dd, yyyy")}</small>
      </div>
      <p>{postContent.text}</p>
      {postContent.likes.some((e) => e.id === user.id) ? (
        <button className={styles.postButton} onClick={handleUnlikePost}>
          Unlike
        </button>
      ) : (
        <button className={styles.postButton} onClick={handleLikePost}>
          Like
        </button>
      )}

      <button className={styles.postButton}>Comment</button>
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
  setPostData: PropTypes.func,
  postData: PropTypes.array,
};
