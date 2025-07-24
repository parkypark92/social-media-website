import ProfilePicture from "../profilePicture/ProfilePicture";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./FriendRequestPreview.module.css";
import PropTypes from "prop-types";

export default function FriendRequestsPreview({ limit }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const fetchRequests = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/get-requests-preview",
      { params: { id: user?.id, limit } }
    );
    if (response.data.requests) {
      return response.data;
    } else {
      throw new Error("Error retrieving requests");
    }
  };

  const answerRequest = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/answer-request",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      alert("Something went wrong! Please try again.");
    }
  };

  const requestsPreviewQuery = useQuery({
    queryKey: ["requests preview", user.id],
    queryFn: fetchRequests,
  });

  const answerRequestMutation = useMutation({
    mutationFn: answerRequest,
    onSuccess: (data) => {
      console.log(queryClient.getQueryData(["requests preview", user.id]));
      console.log(data);
      queryClient.setQueryData(["requests preview", user.id], (oldData) => {
        return {
          requests: oldData["requests"].map((prev) => {
            if (prev.id === data.friendshipStatus[0].id) {
              return {
                ...prev,
                status: data.friendshipStatus[0].status,
              };
            } else {
              return prev;
            }
          }),
        };
      });
    },
  });

  const callMutation = (e) => {
    e.preventDefault();
    answerRequestMutation.mutate({
      receiverId: user.id,
      senderId: e.target.dataset.sender,
      status: e.target.id,
    });
  };

  if (requestsPreviewQuery.isLoading) return <h2>Loading...</h2>;
  if (requestsPreviewQuery.isError)
    return <h2>{requestsPreviewQuery.error.message}</h2>;

  return (
    <div>
      {requestsPreviewQuery.data.requests.length > 0 ? (
        requestsPreviewQuery.data.requests.map((request) => {
          return (
            <div className={styles.requestPreviewDisplay} key={request.id}>
              <div className={styles.avatar}>
                <ProfilePicture userId={request.sender.id} />
                <li>{request.sender.username}</li>
              </div>

              {request.status === "accepted" ? (
                <p>Request Accepted!</p>
              ) : request.status === "declined" ? (
                <p>Request Declined!</p>
              ) : (
                <div className={styles.buttons}>
                  <button
                    data-sender={request.sender.id}
                    id="accepted"
                    onClick={callMutation}
                  >
                    Accept
                  </button>
                  <button
                    data-sender={request.sender.id}
                    id="declined"
                    onClick={callMutation}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No friend requests!</p>
      )}

      {limit && requestsPreviewQuery.data.requests.length > 0 ? (
        <Link to={`/${user?.id}/friend-requests`}>View all</Link>
      ) : !limit ? (
        <Link to={`/${user?.id}`}>Back</Link>
      ) : undefined}
    </div>
  );
}

FriendRequestsPreview.propTypes = {
  limit: PropTypes.number,
};
