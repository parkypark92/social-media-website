import styles from "./ImageCircle.module.css";
import PropTypes from "prop-types";

export default function ImageCircle({ profilePicture, size }) {
  return (
    <div
      className={styles.imgCircle}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        maxHeight: `${size}px`,
        maxWidth: `${size}px`,
      }}
    >
      <img className={styles.image} src={profilePicture} alt="" height={size} />
    </div>
  );
}

ImageCircle.propTypes = {
  profilePicture: PropTypes.string,
  size: PropTypes.string,
};
