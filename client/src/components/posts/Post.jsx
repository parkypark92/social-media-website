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

  //LIKE FUNCTIONS
  const handleLikePost = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/like-post",
      data
    );
    if (response.status === 200) {
      return response.data.updatedPost;
    } else {
      alert("An error occurred! Please try again.");
    }
  };

  const likePostMutation = useMutation({
    mutationFn: handleLikePost,
    onSuccess: (postData) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postData.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      likeNotificationMutation.mutate(postData);
    },
  });

  const callLikeMutation = (e) => {
    e.preventDefault;
    likePostMutation.mutate({
      postId: postContent.id,
      userId: user.id,
    });
  };

  //NOTIFICATION FUNCTIONS
  const handleLikeNotification = async (postData) => {
    const data = {
      type: "like",
      message: `${user.username} liked your post`,
      recipientId: postData.authorId,
      senderId: user.id,
      postId: postData.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/post-notification",
      data
    );
    if (response.status === 200) {
      return response.data.notification;
    }
  };

  const likeNotificationMutation = useMutation({
    mutationFn: handleLikeNotification,
    onSuccess: (notificationData) => {
      socket.emit("send-notification", notificationData);
    },
  });

  //UNLIKE FUNCTIONS
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

  const unlikePostMutation = useMutation({
    mutationFn: handleUnlikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

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
      <CreateComment postInfo={postContent}></CreateComment>
      <Comments comments={postContent.comments}></Comments>
      {feedPost && <Link to={`/post/${postContent.id}`}>View Post</Link>}
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
  feedPost: PropTypes.bool,
};
