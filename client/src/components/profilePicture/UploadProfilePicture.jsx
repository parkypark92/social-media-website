// import { useState } from "react";
import styles from "./UploadProfilePicture.module.css";

export default function UploadProfilePicture() {
  //   const [imageUploading, setImageUploading] = useState(false);
  return (
    <div className={styles.uploadImgCtnr}>
      <form>
        <input type="file" name="profile-picture" id="profile-picture" />
      </form>
    </div>
  );
}
