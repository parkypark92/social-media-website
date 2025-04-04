import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import styles from "./UploadProfilePicture.module.css";

export default function UploadProfilePicture() {
  const { user } = useOutletContext();
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validImageType = (fileToVerify) => {
    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    return validTypes.includes(fileToVerify.type);
  };

  const compressImage = async (image) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(image, options);
      return compressedFile;
      // throw new Error("oops");
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setImageUploading(true);
    const file = fileInputRef.current.files[0];

    try {
      if (!validImageType(file)) {
        throw new Error("File must be .jpg, .jpeg or .png");
      }
      const compressedImage = await compressImage(file);
      if (!compressedImage) {
        throw new Error("Upload error, try again!");
      }
      const formData = new FormData();
      formData.append("file", compressedImage);
      formData.append("id", user.id);
      const response = await axios.post(
        "http://localhost:3000/users/upload-profile-picture",
        formData
      );
      if (response.status === 200) {
        alert("Profile picture updated!");
        navigate(`/${user.id}`);
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className={styles.uploadImgCtnr}>
      {imageUploading ? (
        <h2>...Uploading</h2>
      ) : uploadError ? (
        <div>
          <h2>{uploadError}</h2>
          <button onClick={() => setUploadError(null)}>Retry</button>
        </div>
      ) : (
        <form method="POST" encType="multipart/form-data">
          <input
            type="file"
            name="file"
            id="profile-picture"
            accept=".jpg, .jpeg, .png"
            ref={fileInputRef}
          />
          <button onClick={handleImageUpload}>Upload</button>
        </form>
      )}
    </div>
  );
}
