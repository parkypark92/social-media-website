import ImageCircle from "./ImageCircle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

export default function ProfilePicture({ userId, size = 48, link = true }) {
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
    <>
      {link ? (
        <Link to={`/profile/${userId}`}>
          <ImageCircle profilePicture={profilePicture} size={size} />
        </Link>
      ) : (
        <ImageCircle profilePicture={profilePicture} size={size} />
      )}
    </>
  );
}

ProfilePicture.propTypes = {
  userId: PropTypes.string,
  size: PropTypes.number,
  link: PropTypes.bool,
};
