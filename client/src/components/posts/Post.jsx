import PropTypes from "prop-types";
import styles from "./Post.module.css";
import { format, parseISO } from "date-fns";

export default function Post({ postContent }) {
  return (
    <div className={styles.postContainer}>
      <div className={styles.authorAndDate}>
        <h3 style={{ margin: 0 }}>{postContent.author.username}</h3>
        <small>{format(parseISO(postContent.postedAt), "MMMM dd, yyyy")}</small>
      </div>
      <p>{postContent.text}</p>
      <button className={styles.postButton}>Like</button>
      <button className={styles.postButton}>Comment</button>
    </div>
  );
}

Post.propTypes = {
  postContent: PropTypes.object,
};
