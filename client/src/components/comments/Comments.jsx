import ProfilePicture from "../profilePicture/ProfilePicture";
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
                <div className={styles.avatar}>
                  <ProfilePicture userId={comment.author.id} />
                  <h3>{comment.author.username}</h3>
                </div>
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
