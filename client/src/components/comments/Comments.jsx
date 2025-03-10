import PropTypes from "prop-types";
import styles from "./Comments.module.css";

export default function Comments({ comments }) {
  return (
    <div>
      {comments &&
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
        })}
    </div>
  );
}

Comments.propTypes = {
  comments: PropTypes.array,
};
