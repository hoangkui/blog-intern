import axios from "axios";

const createFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", import.meta.env.VITE_API_KEY_CLOUDINARY);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  return formData;
};
export default async (file: File) => {
  if (!file) return undefined;

  const res = await axios.post(
    import.meta.env.VITE_URL_IMG,
    createFormData(file)
  );
  return res.data.url;
};
export const getArrayUrl = async (files: File[]) => {
  const arrFormData = files.map((item) => createFormData(item));
  const res = await axios.all(
    arrFormData.map((item) => axios.post(import.meta.env.VITE_URL_IMG, item))
  );
  return res.map((item) => item.data.url);
};
