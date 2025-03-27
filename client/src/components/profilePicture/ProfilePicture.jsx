import styles from "./ProfilePicture.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProfilePicture({ userId }) {
  return (
    <Link to={`/profile/${userId}`}>
      <div className={styles.imgCircle}> </div>
    </Link>
  );
}

ProfilePicture.propTypes = {
  userId: PropTypes.string,
};
