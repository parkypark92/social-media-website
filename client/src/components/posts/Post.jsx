import PropTypes from "prop-types";
import styles from "./Post.module.css";

export default function Post({ postContent }) {
  return (
    <div className={styles.postContainer}>
      <h3>{postContent}</h3>
      <button className={styles.postButton}>Like</button>
      <button className={styles.postButton}>Comment</button>
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.string,
};
