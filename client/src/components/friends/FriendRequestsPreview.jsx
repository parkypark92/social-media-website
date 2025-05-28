import ProfilePicture from "../profilePicture/ProfilePicture";
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./FriendRequestPreview.module.css";
import PropTypes from "prop-types";

export default function FriendRequestsPreview({ limit }) {
  const [requestsPreview, setRequestsPreview] = useState([]);
  const { user } = useOutletContext();

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

  useEffect(() => {
    if (requestsPreviewQuery.isSuccess) {
      setRequestsPreview(requestsPreviewQuery.data.requests);
    }
  }, [requestsPreviewQuery.data?.requests, requestsPreviewQuery.isSuccess]);

  const handleRequest = async (e) => {
    e.preventDefault();
    const data = {
      receiverId: user.id,
      senderId: e.target.dataset.sender,
      status: e.target.id,
    };
    const response = await axios.post(
      "http://localhost:3000/users/answer-request",
      data
    );
    if (response.status === 200) {
      setRequestsPreview(
        requestsPreview.map((prev) => {
          if (prev.id === response.data.friendshipStatus[0].id) {
            return {
              ...prev,
              status: e.target.id,
            };
          } else {
            return prev;
          }
        })
      );
    }
  };

  if (requestsPreviewQuery.isLoading) return <h2>Loading...</h2>;
  if (requestsPreviewQuery.isError)
    return <h2>{requestsPreviewQuery.error.message}</h2>;

  return (
    <div>
      {requestsPreview.length ? (
        requestsPreview.map((request) => {
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
                <div>
                  <button
                    data-sender={request.sender.id}
                    id="accepted"
                    onClick={handleRequest}
                  >
                    Accept
                  </button>
                  <button
                    data-sender={request.sender.id}
                    id="declined"
                    onClick={handleRequest}
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

      {limit && requestsPreview.length ? (
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
