import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./RequestFriends.module.css";

export default function RequestFriends() {
  const [usersPreview, setUsersPreview] = useState([]);
  const { user } = useOutletContext();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/users-preview",
        {
          params: { id: user.id },
        }
      );
      setUsersPreview(response.data.users);
    };
    fetchUsers();
  }, [user]);

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
        alert("Friend request sent successfully!");
        console.log("Response:", response.data);
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
      <h2>Find some new friends!</h2>
      {usersPreview.map((item) => {
        return (
          <div key={item.id} className={styles.usersList}>
            {console.log(item)}
            <li>{item.username}</li>
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
      })}
      <Link>View all</Link>
    </div>
  );
}
