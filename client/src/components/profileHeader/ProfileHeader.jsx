import ProfilePicture from "../profilePicture/ProfilePicture";
// import UploadProfilePicture from "../profilePicture/UploadProfilePicture";
import styles from "./ProfileHeader.module.css";
import PropTypes from "prop-types";

export default function ProfileHeader({ profileInfo }) {
  return (
    <div className={styles.container}>
      <ProfilePicture userId={profileInfo.id} size={96} />
      <h2>{profileInfo.username}</h2>
    </div>
  );
}

ProfileHeader.propTypes = {
  profileInfo: PropTypes.object,
};
