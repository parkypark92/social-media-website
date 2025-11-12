import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import styles from "./ProfilePicturePrompt.module.css";

export default function ProfilePicturePrompt() {
  console.log("prompt");
  const { user } = useOutletContext();

  const handleFirstLoginUpdate = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await axios.post(`${BASE_URL}/login/update-first-login`, {
      userId: user.id,
    });
    if (response.status !== 200) {
      alert("An error has occurred");
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        Welcome, faceless user! How about getting started with a profile
        picture?
      </h2>
      <div className={styles.buttons}>
        <Link
          to={`/profile/${user.id}/upload-profile-picture`}
          onClick={handleFirstLoginUpdate}
        >
          Upload
        </Link>
        <Link to={`/${user.id}`} onClick={handleFirstLoginUpdate}>
          Skip
        </Link>
      </div>
    </div>
  );
}
