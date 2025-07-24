import Post from "../components/posts/Post";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SinglePost() {
  const { postId } = useParams();

  const fetchSinglePost = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/get-single-post",
      {
        params: { postId },
      }
    );
    if (response.data.post) {
      console.log(response.data.post);
      return response.data;
    } else {
      throw new Error("Error loading posts feed");
    }
  };

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: fetchSinglePost,
  });

  if (postQuery.isLoading) return <h2>Loading post...</h2>;

  return (
    <>
      {postQuery.data.post && (
        <Post postContent={postQuery.data.post} feedPost={false}></Post>
      )}
    </>
  );
}
