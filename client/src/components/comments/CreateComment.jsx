import axios from "axios";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";

export default function CreateComment({ postId, postData, setPostData }) {
  const { user } = useOutletContext();
  const [text, setText] = useState("");
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const submitComment = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      text: data.get("newComment"),
      authorId: user.id,
      postId: postId,
    };
    const response = await axios.post(
      "http://localhost:3000/users/create-comment",
      formData
    );
    if (response.status === 200) {
      console.log(response.data.msg);
      setText("");
      setPostData(
        postData.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, response.data.comment],
            };
          } else {
            return post;
          }
        })
      );
    } else {
      console.log("Error");
    }
  };

  return (
    <form onSubmit={submitComment}>
      <input
        type="text"
        name="newComment"
        id="newComment"
        placeholder="Leave a comment..."
        aria-label="New Comment"
        value={text}
        onChange={handleChange}
      />
      <button>Submit</button>
    </form>
  );
}

CreateComment.propTypes = {
  postId: PropTypes.string,
  setPostData: PropTypes.func,
  postData: PropTypes.array,
};
