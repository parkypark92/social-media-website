import ProfilePicture from "../profilePicture/ProfilePicture";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketProvider";
import styles from "./RequestFriends.module.css";
import shared from "../../css/SharedStyle.module.css";
import PropTypes from "prop-types";

export default function RequestFriends({ limit }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/users-preview`, {
      params: { id: user?.id, limit },
    });
    if (response.data.users) {
      return response.data;
    } else {
      throw new Error("Error retrieving users");
    }
  };

  const usersQuery = useQuery({
    queryKey: ["users", user.id, limit],
    queryFn: fetchUsers,
  });

  //REQUEST FUNCTIONS
  const sendRequest = async (data) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(`${BASE_URL}/users/friend-request`, data);
    if (response.status === 200) {
      return response.data.friendRequest;
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const sendRequestMutation = useMutation({
    mutationFn: sendRequest,
    onSuccess: async (friendshipData) => {
      queryClient.setQueryData(["users", user.id, limit], (oldData) => {
        return {
          users: oldData.users.map((item) => {
            if (item.id == friendshipData.receiverId) {
              return {
                ...item,
                receivedRequests: [...item.receivedRequests, friendshipData],
              };
            } else {
              return item;
            }
          }),
        };
      });
      requestNotificationMutation.mutate(friendshipData);
    },
  });

  const callMutation = (e) => {
    e.preventDefault();
    sendRequestMutation.mutate({
      sentBy: user.id,
      receivedBy: e.target.id,
    });
  };

  //NOTIFICATIONS FUNCTIONS
  const handleRequestNotification = async (friendshipData) => {
    const data = {
      type: "friend-request",
      message: `${user.username} sent you a friend request`,
      recipientId: friendshipData.receiverId,
      senderId: user.id,
    };
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.post(
      `${BASE_URL}/users/friend-request-notification`,
      data
    );
    if (response.status === 200) {
      return response.data.notification;
    }
  };

  const requestNotificationMutation = useMutation({
    mutationFn: handleRequestNotification,
    onSuccess: (notificationData) => {
      socket.emit("send-notification", notificationData);
    },
  });

  if (usersQuery.isLoading) return <h2>Loading...</h2>;
  if (usersQuery.isError) return <h2>{usersQuery.error.message}</h2>;

  return (
    <div>
      <h2>Find some new friends!</h2>

      {usersQuery.data.users.length > 0 ? (
        usersQuery.data.users.map((item) => {
          return (
            <div key={item.id} className={styles.usersList}>
              <div className={styles.avatar}>
                <ProfilePicture userId={item.id} />
                <li>{item.username}</li>
              </div>
              {item.receivedRequests.some(
                (item) => item.senderId == user.id
              ) ? (
                <p>Request sent!</p>
              ) : (
                <button id={item.id} onClick={callMutation}>
                  Send request
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p>No suggestions right now!</p>
      )}
      {limit && usersQuery.data.users.length > 0 ? (
        <Link to={`/${user?.id}/find-friends`}>View all</Link>
      ) : !limit ? (
        <button className={shared.backLink} onClick={() => navigate(-1)}>
          Back
        </button>
      ) : undefined}
    </div>
  );
}

RequestFriends.propTypes = {
  limit: PropTypes.number,
};
