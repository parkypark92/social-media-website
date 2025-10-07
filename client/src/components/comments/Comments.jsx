import ProfilePicture from "../profilePicture/ProfilePicture";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import PropTypes from "prop-types";
import styles from "./Comments.module.css";

export default function Comments({ postId }) {
  const fetchComments = async ({ pageParam = 1 }) => {
    const limit = 2;
    const response = await axios.get(
      "http://localhost:3000/users/get-post-comments",
      { params: { postId, limit, page: pageParam } }
    );
    if (response.data.comments) {
      return {
        comments: response.data.comments,
        nextPage:
          response.data.comments.length === limit ? pageParam + 1 : undefined,
      };
    } else {
      throw new Error("Error dislpaying post!");
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: fetchComments,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div>
      {allComments.length ? (
        <>
          {allComments.map((comment) => {
            return (
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
            );
          })}
          {hasNextPage && (
            <button onClick={fetchNextPage} disabled={isFetching}>
              Load More
            </button>
          )}
        </>
      ) : (
        <p>No comments yet...</p>
      )}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string,
};
