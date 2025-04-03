import ProfilePicture from "../profilePicture/ProfilePicture";
import CreateComment from "../comments/CreateComment";
import Comments from "../comments/Comments";
import PropTypes from "prop-types";
import styles from "./Post.module.css";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Post({ postContent, setPostData, postData }) {
  const { user } = useOutletContext();

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
        <ProfilePicture userId={postContent.author.id} />
        <h3 style={{ margin: 0 }}>{postContent.author.username}</h3>
        <small>{format(parseISO(postContent.postedAt), "MMMM dd, yyyy")}</small>
      </div>
      <p>{postContent.text}</p>
      <div className={styles.likes}>
        {postContent.likes.some((e) => e.id === user.id) ? (
          <button className={styles.postButton} onClick={handleUnlikePost}>
            <img
              className={styles.fullHeartIcon}
              src="/heart-full.png"
              alt=""
              height={24}
            />
          </button>
        ) : (
          <button className={styles.postButton} onClick={handleLikePost}>
            <img
              className={styles.emptyHeartIcon}
              src="/heart.png"
              alt=""
              height={24}
            />
          </button>
        )}
        <span>{postContent.likes.length}</span>
      </div>
      <CreateComment
        postId={postContent.id}
        setPostData={setPostData}
        postData={postData}
      ></CreateComment>
      <h2>Comments</h2>
      <hr />
      <Comments comments={postContent.comments}></Comments>
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
  setPostData: PropTypes.func,
  postData: PropTypes.array,
};
