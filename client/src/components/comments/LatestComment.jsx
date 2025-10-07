import ProfilePicture from "../profilePicture/ProfilePicture";
import PropTypes from "prop-types";
import styles from "./Comments.module.css";

export default function LatestComment({ latestComment }) {
  const [comment] = latestComment;
  return (
    <div>
      {comment ? (
        <div key={comment.id}>
          <div className={styles.commentCtnr}>
            <div className={styles.avatar}>
              <ProfilePicture userId={comment.author.id} size={32} />
              <h4 className={styles.commentAuthor}>
                {comment.author.username}
              </h4>
            </div>
            <p className={styles.commentText}>{comment.text}</p>
          </div>
          <hr className={styles.commentSeperator} />
        </div>
      ) : (
        <p>No comments yet...</p>
      )}
    </div>
  );
}

LatestComment.propTypes = {
  latestComment: PropTypes.array,
};
