import ProfilePicture from "../profilePicture/ProfilePicture";
import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./RequestFriends.module.css";
import PropTypes from "prop-types";

export default function RequestFriends({ limit }) {
  const [usersPreview, setUsersPreview] = useState([]);
  const { user } = useOutletContext();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/users-preview",
        {
          params: { id: user.id, limit },
        }
      );
      setUsersPreview(response.data.users);
    };
    fetchUsers();
  }, [user, limit]);

  const sendRequest = async (e) => {
    e.preventDefault();
    const data = {
      sentBy: user.id,
      receivedBy: e.target.id,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/users/friend-request",
        data
      );
      if (response.status === 200) {
        setUsersPreview(
          usersPreview.map((item) => {
            if (item.id === user.id) {
              return {
                ...item,
                sentRequests: [...item.sentRequests, e.target.id],
              };
            }
            if (item.id === e.target.id) {
              return {
                ...item,
                receivedRequests: [...item.receivedRequests, user.id],
              };
            } else {
              return item;
            }
          })
        );
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("Unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      {usersPreview.length ? (
        usersPreview.map((item) => {
          return (
            <div key={item.id} className={styles.usersList}>
              <div className={styles.avatar}>
                <ProfilePicture userId={item.id} />
                <li>{item.username}</li>
              </div>
              {item.sentRequests.includes(user.id) ||
              item.receivedRequests.includes(user.id) ? (
                <p>Request sent!</p>
              ) : (
                <button id={item.id} onClick={sendRequest}>
                  Send request
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p>No suggestions right now!</p>
      )}
      {limit && usersPreview.length ? (
        <Link to={`/${user.id}/find-friends`}>View all</Link>
      ) : !limit ? (
        <Link to={`/${user.id}`}>Back</Link>
      ) : undefined}
    </div>
  );
}

RequestFriends.propTypes = {
  limit: PropTypes.number,
};
