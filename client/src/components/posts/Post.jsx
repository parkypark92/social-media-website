import PropTypes from "prop-types";
import styles from "./Post.module.css";

export default function Post({ postContent }) {
  return (
    <div className={styles.postContainer}>
      <p>{postContent}</p>
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.string,
};
