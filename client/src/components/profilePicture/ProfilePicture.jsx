import ImageCircle from "./ImageCircle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePicture({ userId, size = 48, link = true }) {
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchProfilePicture = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${BASE_URL}/users/profile-picture`, {
      params: { userId },
    });
    if (response.status === 200) {
      return response.data.imageUrl
        ? response.data
        : { imageUrl: "/profile-alt.png" };
    } else {
      throw new Error();
    }
  };

  const profilePictureQuery = useQuery({
    queryKey: ["profile picture", userId],
    queryFn: fetchProfilePicture,
    enabled: !!userId,
  });

  useEffect(() => {
    if (profilePictureQuery.isSuccess) {
      setProfilePicture(profilePictureQuery.data.imageUrl);
    }
    if (profilePictureQuery.isError) {
      setProfilePicture("/profile-alt.png");
    }
  }, [
    profilePictureQuery.data?.imageUrl,
    profilePictureQuery.isError,
    profilePictureQuery.isSuccess,
  ]);

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
