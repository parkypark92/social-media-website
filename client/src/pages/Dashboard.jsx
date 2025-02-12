import CreatePost from "../components/createPost/CreatePost";
import PostsFeed from "../components/posts/PostsFeed";
import { useState } from "react";

export default function Dashboard() {
  const [postData, setPostData] = useState([]);

  return (
    <>
      <h1>Dashboard</h1>
      <CreatePost postData={postData} setPostData={setPostData} />
      <PostsFeed postData={postData} setPostData={setPostData} />
    </>
  );
}
