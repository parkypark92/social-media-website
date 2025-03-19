import PropTypes from "prop-types";
import styles from "./Comments.module.css";

export default function Comments({ comments }) {
  return (
    <div>
      {comments.length ? (
        comments.map((comment) => {
          return (
            <div key={comment.id}>
              <div className={styles.commentCtnr}>
                <h3>{comment.author.username}</h3>
                <p>{comment.text}</p>
              </div>
              <hr />
            </div>
          );
        })
      ) : (
        <p>No comments yet...</p>
      )}
    </div>
  );
}

Comments.propTypes = {
  comments: PropTypes.array,
};
