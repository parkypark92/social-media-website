import Post from "./Post";
import PropTypes from "prop-types";

export default function ProfilePosts({ profilePosts }) {
  return (
    <div>
      {profilePosts.map((post) => {
        return <Post key={post.id} postContent={post} />;
      })}
    </div>
  );
}

ProfilePosts.propTypes = {
  profilePosts: PropTypes.array,
};
