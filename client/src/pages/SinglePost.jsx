import Post from "../components/posts/Post";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styles from "./SinglePost.module.css";

export default function SinglePost() {
  const { postId } = useParams();

  const fetchSinglePost = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/get-single-post`, {
      params: { postId },
    });
    if (response.data.post) {
      console.log(response.data.post);
      return response.data;
    } else {
      throw new Error("Error dislpaying post!");
    }
  };

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: fetchSinglePost,
  });

  if (postQuery.isLoading) return <h2>Loading post...</h2>;

  return (
    <div className={styles.container}>
      {postQuery.data.post && <Post postContent={postQuery.data.post}></Post>}
    </div>
  );
}
