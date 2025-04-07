import imageCompression from "browser-image-compression";

export const validImageType = (fileToVerify) => {
  const validTypes = ["image/jpg", "image/jpeg", "image/png"];
  return validTypes.includes(fileToVerify.type);
};

export const compressImage = async (image) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
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

export function getCroppedImg(imageSrc, crop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = (err) => {
      reject(err);
    };
  });
}
