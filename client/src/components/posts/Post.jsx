import ProfilePicture from "../profilePicture/ProfilePicture";
import CreateComment from "../comments/CreateComment";
import Comments from "../comments/Comments";
import PropTypes from "prop-types";
import styles from "./Post.module.css";
import axios from "axios";
import { useSocket } from "../../contexts/SocketProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

export default function Post({ postContent, feedPost = false }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const handleLikePost = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/like-post",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      alert("An error occurred! Please try again.");
    }
  };

  const handleUnlikePost = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/unlike-post",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      alert("An error occurred! Please try again.");
    }
  };

  const likePostMutation = useMutation({
    mutationFn: handleLikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const recipientId = postContent.author.id;
      const likedBy = user.username;
      socket.emit("post-liked", likedBy, recipientId);
    },
  });

  const unlikePostMutation = useMutation({
    mutationFn: handleUnlikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const callLikeMutation = (e) => {
    e.preventDefault;
    likePostMutation.mutate({
      postId: postContent.id,
      userId: user.id,
    });
  };
  const callunlikeMutation = (e) => {
    e.preventDefault;
    unlikePostMutation.mutate({
      postId: postContent.id,
      userId: user.id,
    });
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <ProfilePicture userId={postContent.author.id} />
        <div className={styles.authorAndDate}>
          <h3 style={{ margin: 0 }}>{postContent.author.username}</h3>
          <small>
            {format(parseISO(postContent.postedAt), "MMMM dd, yyyy")}
          </small>
        </div>
      </div>
      <p>{postContent.text}</p>
      <div className={styles.likes}>
        {postContent.likes.some((e) => e.id === user?.id) ? (
          <button className={styles.postButton} onClick={callunlikeMutation}>
            <img
              className={styles.fullHeartIcon}
              src="/heart-full.png"
              alt=""
              height={24}
            />
          </button>
        ) : (
          <button className={styles.postButton} onClick={callLikeMutation}>
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
      <CreateComment postId={postContent.id}></CreateComment>
      <Comments comments={postContent.comments}></Comments>
      {feedPost && <Link to={`/post/${postContent.id}`}>View Post</Link>}
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
  feedPost: PropTypes.bool,
};
