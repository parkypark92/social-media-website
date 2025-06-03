import ProfilePicture from "../profilePicture/ProfilePicture";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./RequestFriends.module.css";
import PropTypes from "prop-types";

export default function RequestFriends({ limit }) {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    const response = await axios.get(
      "http://localhost:3000/users/users-preview",
      {
        params: { id: user?.id, limit },
      }
    );
    if (response.data.users) {
      return response.data;
    } else {
      throw new Error("Error retrieving users");
    }
  };

  const sendRequest = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/users/friend-request",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const usersQuery = useQuery({
    queryKey: ["users", user.id, limit],
    queryFn: fetchUsers,
  });

  const sendRequestMutation = useMutation({
    mutationFn: sendRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(["users", user.id, limit], (oldData) => {
        return {
          users: oldData.users.map((item) => {
            if (item.id == data.friendRequest.receiverId) {
              return {
                ...item,
                receivedRequests: [
                  ...item.receivedRequests,
                  data.friendRequest,
                ],
              };
            } else {
              return item;
            }
          }),
        };
      });
    },
  });

  const callMutation = (e) => {
    e.preventDefault();
    sendRequestMutation.mutate({
      sentBy: user.id,
      receivedBy: e.target.id,
    });
  };

  if (usersQuery.isLoading) return <h2>Loading...</h2>;
  if (usersQuery.isError) return <h2>{usersQuery.error.message}</h2>;

  return (
    <div>
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
        <Link to={`/${user?.id}`}>Back</Link>
      ) : undefined}
    </div>
  );
}

RequestFriends.propTypes = {
  limit: PropTypes.number,
};
