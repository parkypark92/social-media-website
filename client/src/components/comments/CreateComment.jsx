import axios from "axios";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import styles from "./CreateComment.module.css";

export default function CreateComment({ postId }) {
  const { user } = useOutletContext();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setText(e.target.value);
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
      setText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const callMutation = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      text: data.get("newComment"),
      authorId: user.id,
      postId: postId,
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
          value={text}
          className={styles.commentInput}
          onChange={handleChange}
        />
        <button className={styles.commentSubmit}>Submit</button>
      </div>
    </form>
  );
}

CreateComment.propTypes = {
  postId: PropTypes.string,
};
