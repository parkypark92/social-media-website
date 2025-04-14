import Post from "./Post";
import PropTypes from "prop-types";

export default function ProfilePosts({ profilePosts, setProfilePosts }) {
  return (
    <div>
      {profilePosts.map((post) => {
        return (
          <Post
            key={post.id}
            postContent={post}
            setPostData={setProfilePosts}
            postData={profilePosts}
          />
        );
      })}
    </div>
  );
}

ProfilePosts.propTypes = {
  profilePosts: PropTypes.array,
  setProfilePosts: PropTypes.func,
};
