import { useState, useCallback } from "react";
import {
  validImageType,
  compressImage,
  getCroppedImg,
} from "../../utils/imageUtils";
import Cropper from "react-easy-crop";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import styles from "./UploadProfilePicture.module.css";
import shared from "../../css/SharedStyle.module.css";

export default function UploadProfilePicture() {
  const { user } = useOutletContext();
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const navigate = useNavigate();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!validImageType(file)) {
        throw new Error("File must be .jpg, .jpeg or .png");
      }
      const compressedImage = await compressImage(file);
      if (!compressedImage) {
        throw new Error("Upload error, try again!");
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setImageUploading(true);
    setIsCropping(false);
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    try {
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("id", user.id);
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await axios.post(
        `${BASE_URL}/users/upload-profile-picture`,
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
      ) : isCropping ? (
        <div>
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // square crop
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={styles.uploadButtons}>
            <button onClick={handleImageUpload}>Upload</button>
            <button onClick={() => setIsCropping(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <form method="POST" encType="multipart/form-data">
            <input
              type="file"
              name="file"
              id="profile-picture"
              accept=".jpg, .jpeg, .png"
              onChange={onFileChange}
            />
          </form>
          <button className={shared.backLink} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
