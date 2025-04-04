import { useEffect, useState } from "react";
import styles from "./ProfilePicture.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

export default function ProfilePicture({ userId }) {
  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const response = await axios.get(
        "http://localhost:3000/users/profile-picture",
        { params: { userId } }
      );
      if (response.status === 200) {
        if (response.data.imageUrl) {
          setProfilePicture(response.data.imageUrl);
        } else {
          setProfilePicture("/profile-alt.png");
        }
      } else {
        console.log("Error fetching profile picture");
        setProfilePicture("/profile-alt.png");
      }
    };
    fetchProfilePicture();
  }, [userId]);

  return (
    <Link to={`/profile/${userId}`}>
      <div className={styles.imgCircle}>
        <img className={styles.image} src={profilePicture} alt="" height={48} />
      </div>
    </Link>
  );
}

ProfilePicture.propTypes = {
  userId: PropTypes.string,
};
