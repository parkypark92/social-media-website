import ProfilePicture from "../profilePicture/ProfilePicture.jsx";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./CreatePost.module.css";

export default function CreatePost() {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const publishPost = async (data) => {
    const formData = {
      text: data.get("newPost"),
      userId: user.id,
    };
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(
      `${BASE_URL}/users/create-post`,
      formData
    );
    if (response.status === 201) {
      return response.data.post;
    }
  };

  const createPostMutation = useMutation({
    mutationFn: publishPost,
    onSuccess: () => {
      setInputText("");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    createPostMutation.mutate(new FormData(e.target));
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
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
            value={inputText}
            placeholder="What's on your mind..."
            aria-label="new post"
            onChange={handleChange}
          />
          <button
            disabled={inputText === "" ? true : false}
            className={inputText === "" ? styles.disabled : undefined}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
