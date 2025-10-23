import ProfilePicture from "../profilePicture/ProfilePicture";
import CreateComment from "../comments/CreateComment";
import Comments from "../comments/Comments";
import LatestComment from "../comments/LatestComment";
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
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/like-post`, data);
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
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(
      `${BASE_URL}/users/post-notification`,
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
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/unlike-post`, data);
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

  //SAVE POST FUNCTIONS
  const handleSavePost = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await axios.post(`${BASE_URL}/users/save-post`, data);
    if (response.status === 200) {
      return response.data.savedPost;
    } else {
      alert("An error occured, please try again");
    }
  };

  const savePostMutation = useMutation({
    mutationFn: handleSavePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const callSavePostMutation = (e) => {
    e.preventDefault();
    savePostMutation.mutate({
      postId: postContent.id,
      userId: user.id,
    });
  };

  //UNSAVE POST FUNCTIONS
  const handleUnsavePost = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await axios.post(`${BASE_URL}/users/unsave-post`, data);
    if (response.status === 200) {
      return response.data.unsavedPost;
    } else {
      alert("An error occured, please try again");
    }
  };

  const unsavePostMutation = useMutation({
    mutationFn: handleUnsavePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postContent.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const callUnsavePostMutation = (e) => {
    e.preventDefault();
    unsavePostMutation.mutate({
      postId: postContent.id,
      userId: user.id,
    });
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div className={styles.headerLeft}>
          <ProfilePicture userId={postContent.author.id} />
          <div className={styles.authorAndDate}>
            <h3 style={{ margin: 0 }}>{postContent.author.username}</h3>
            <small>
              {format(parseISO(postContent.postedAt), "MMMM dd, yyyy")}
            </small>
          </div>
        </div>
        <div className={styles.headerRight}>
          {postContent.saves?.some((e) => e.id === user?.id) ? (
            <button
              className={styles.postButton}
              onClick={callUnsavePostMutation}
            >
              <img src="/unsave.png" alt="" height={24} />
            </button>
          ) : (
            <button
              className={styles.postButton}
              onClick={callSavePostMutation}
            >
              <img src="/save.png" alt="" height={24} />
            </button>
          )}
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
      {feedPost ? (
        <>
          <LatestComment latestComment={postContent.comments}></LatestComment>
          <Link to={`/post/${postContent.id}`}>View Post</Link>
        </>
      ) : (
        <Comments postId={postContent.id}></Comments>
      )}
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
  feedPost: PropTypes.bool,
};
