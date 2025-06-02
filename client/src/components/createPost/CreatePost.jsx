import ProfilePicture from "../profilePicture/ProfilePicture.jsx";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./CreatePost.module.css";

export default function CreatePost() {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const publishPost = async (data) => {
    const formData = {
      text: data.get("newPost"),
      userId: user.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/create-post",
      formData
    );
    if (response.status === 201) {
      return response.data.post;
    }
  };

  const createPostMutation = useMutation({
    mutationFn: publishPost,
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    createPostMutation.mutate(new FormData(e.target));
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.createPostContainer}>
      <ProfilePicture userId={user?.id} />
      <form className={styles.createPostForm} onSubmit={submitForm}>
        <div className={styles.createPost}>
          <input
            className={styles.createPostInput}
            type="text"
            name="newPost"
            id="newPost"
            value={text}
            placeholder="What's on your mind..."
            aria-label="new post"
            onChange={handleChange}
          />
          <button>Publish</button>
        </div>
      </form>
    </div>
  );
}
