import ProfilePicture from "../profilePicture/ProfilePicture";
// import UploadProfilePicture from "../profilePicture/UploadProfilePicture";
import styles from "./ProfileHeader.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProfileHeader({ profileInfo, ownProfile = false }) {
  return (
    <div className={styles.container}>
      <ProfilePicture userId={profileInfo.id} size={96} />
      <h2>{profileInfo.username}</h2>
      {ownProfile && (
        <Link to={`/profile/${profileInfo.id}/upload-profile-picture`}>
          {profileInfo.profileUrl
            ? "Update Profile Picture"
            : "Add Profile Picture"}
        </Link>
      )}
    </div>
  );
}

ProfileHeader.propTypes = {
  profileInfo: PropTypes.object,
  ownProfile: PropTypes.bool,
};
