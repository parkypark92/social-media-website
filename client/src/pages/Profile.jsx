import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import UploadProfilePicture from "../components/profilePicture/UploadProfilePicture";
import ProfilePicture from "../components/profilePicture/ProfilePicture";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user } = useOutletContext();
  const { userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const isOwnProfile = user.id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/profile-info",
        {
          params: { userId },
        }
      );
      if (response.status === 200) {
        setProfileInfo(response.data.profileInfo);
      } else {
        console.log("Error");
      }
    };
    if (!isOwnProfile) {
      fetchUserData();
    }
  }, [isOwnProfile, userId]);

  return (
    <div className={styles.profileContainer}>
      {isOwnProfile ? (
        user.profilePicture ? (
          <ProfilePicture userId={user.id} />
        ) : (
          <UploadProfilePicture />
        )
      ) : profileInfo ? (
        <ProfilePicture userId={profileInfo.id} />
      ) : (
        <h2>...Loading</h2>
      )}
    </div>
  );
}
