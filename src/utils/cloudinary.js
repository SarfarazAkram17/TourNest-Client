import axios from "axios";

const MAX_SIZE_MB = 10;

export const uploadImage = async (file) => {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image.`);
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`"${file.name}" is larger than ${MAX_SIZE_MB} MB.`);
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_cloudinary_preset_name);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_cloud_name}/image/upload`,
    data
  );
  return res.data.secure_url;
};
