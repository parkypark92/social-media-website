import ProfilePicture from "../profilePicture/ProfilePicture";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketProvider";
import styles from "./FriendRequestPreview.module.css";
import PropTypes from "prop-types";

export default function FriendRequestsPreview({ limit }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const socket = useSocket();

  //REQUESTS FUNCTIONS
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

  const requestsPreviewQuery = useQuery({
    queryKey: ["requests preview", user.id],
    queryFn: fetchRequests,
  });

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

  const answerRequestMutation = useMutation({
    mutationFn: answerRequest,
    onSuccess: async (data) => {
      const friendshipData = data.friendshipStatus[0];
      console.log(friendshipData);
      queryClient.setQueryData(["requests preview", user.id], (oldData) => {
        return {
          requests: oldData["requests"].map((prev) => {
            if (prev.id === friendshipData.id) {
              return {
                ...prev,
                status: friendshipData.status,
              };
            } else {
              return prev;
            }
          }),
        };
      });
      if (friendshipData.status === "accepted") {
        queryClient.invalidateQueries(["friends", user.id]);
        notificationMutation.mutate(friendshipData);
      }
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

  //NOTIFICATIONS FUNCTIONS
  const handleAcceptedRequestNotification = async (friendshipData) => {
    const data = {
      type: "accepted-request",
      message: `${user.username} accepted your friend request`,
      recipientId: friendshipData.senderId,
      senderId: user.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/friend-request-notification",
      data
    );
    if (response.status === 200) {
      return response.data.notification;
    } else {
      throw new Error("Error handling notification");
    }
  };

  const notificationMutation = useMutation({
    mutationFn: handleAcceptedRequestNotification,
    onSuccess: (notificationData) => {
      socket.emit("send-notification", notificationData);
    },
  });

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
                    className={styles.decline}
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
