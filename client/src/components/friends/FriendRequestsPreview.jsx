import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import styles from "./FriendRequestPreview.module.css";

export default function FriendRequestsPreview() {
  const [requestsPreview, setRequestsPreview] = useState([]);
  const { user } = useOutletContext();

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/get-requests-preview",
        { params: { id: user.id } }
      );
      if (response.status === 200) {
        setRequestsPreview(response.data.requests);
      } else {
        console.log("Error");
      }
    };
    fetchRequests();
  }, [user]);

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

  return (
    <div>
      <h2>Friend Requests</h2>
      {requestsPreview.map((request) => {
        return (
          <div className={styles.requestPreviewDisplay} key={request.id}>
            <li>{request.sender.username}</li>

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
      })}
    </div>
  );
}
