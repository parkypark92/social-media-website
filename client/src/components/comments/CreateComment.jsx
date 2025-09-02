import axios from "axios";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import styles from "./CreateComment.module.css";
import { useSocket } from "../../contexts/SocketProvider";

export default function CreateComment({ postInfo }) {
  const { user } = useOutletContext();
  const [inputText, setInputtext] = useState("");
  const queryClient = useQueryClient();
  const socket = useSocket();

  const handleChange = (e) => {
    setInputtext(e.target.value);
  };
  const submitComment = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/create-comment",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.log("Error");
    }
  };

  const createCommentMutation = useMutation({
    mutationFn: submitComment,
    onSuccess: () => {
      setInputtext("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postInfo.id] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const commentBy = user.username;
      const recipientId = postInfo.author.id;
      socket.emit("comment", commentBy, recipientId);
    },
  });

  const callMutation = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      text: data.get("newComment"),
      authorId: user.id,
      postId: postInfo.id,
    };
    createCommentMutation.mutate(formData);
  };

  return (
    <form onSubmit={callMutation}>
      <div className={styles.commentForm}>
        <input
          type="text"
          name="newComment"
          id="newComment"
          placeholder="Leave a comment..."
          aria-label="New Comment"
          value={inputText}
          className={styles.commentInput}
          onChange={handleChange}
        />
        <button
          disabled={inputText === "" ? true : false}
          className={inputText === "" ? styles.disabled : styles.commentSubmit}
        >
          <img src="/post.png" alt="" height={24} />
        </button>
      </div>
    </form>
  );
}

CreateComment.propTypes = {
  postInfo: PropTypes.object,
};
