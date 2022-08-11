import { useMutation } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";

import { updateUserMutation } from "../../graphql/mutations";
import { UpdateUser, UpdateUserProps } from "../../graphql/types";
import { storeData, userSelector } from "../../store/reducers/userSlice";
import getUrlImage from "../../utils/getUrlImage";
import LoadingFullScreen from "../utils/LoadingFullScreen";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  username: yup
    .string()
    .min(3, "Username should be of minimum 3 characters length")
    .max(20, "Username should be of maximum 20 characters length")
    .matches(/^[a-zA-Z0-9]+$/, "No space,No special character,")
    .required("Username is required"),
  bio: yup
    .string()
    .min(3, "Bio should be of minimum 3 characters length")
    .max(160, "Bio should be of maximum 160 characters length"),
});
interface ProfileData {
  email: string;
  username: string;
  bio: string;
}
const ChangeInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const [images, setImages] = useState<{ file: File }[]>([]);
  const [loading, setLoading] = useState(false);
  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };
  const [callUpdateUser] = useMutation<UpdateUser, UpdateUserProps>(
    updateUserMutation
  );
  const formik = useFormik({
    initialValues: {
      email: user.email,
      username: user.username,
      bio: user.bio,
    },
    validationSchema: validationSchema,
    onSubmit: async (values: ProfileData) => {
      setLoading(true);
      const image =
        images.length > 0 ? await getUrlImage(images[0].file) : undefined;
      const res = await callUpdateUser({
        variables: {
          input: {
            ...values,
            image,
          },
        },
      });
      setLoading(false);
      if (!res.data) return;
      const { success, message } = res.data.updateUser;
      if (!success) {
        swal(message || "", "", "warning");
        return;
      }
      dispatch(
        storeData({
          ...user,
          ...res.data.updateUser.user,
        })
      );
      swal("Update success", "", "success");
      navigate(`/u/${res.data.updateUser.user.username}`);
    },
  });
  return (
    <div className="flex items-center w-full justify-center flex-col mb-7">
      <LoadingFullScreen loading={loading} />
      <div className="flex justify-center flex-col gap-8 mt-5 w-96">
        <ImageUploading value={images} onChange={onChange} maxNumber={1}>
          {({ imageList, onImageUpdate }) => (
            <div className="flex items-center justify-around">
              <Avatar
                alt="Remy Sharp"
                onClick={() => onImageUpdate(0)}
                src={imageList[0]?.dataURL || user.image}
                sx={{ width: 100, height: 100, border: "1px solid #ccc" }}
              />
              <div className="text-[#0095f6] font-semibold text-sm">
                <button onClick={() => onImageUpdate(0)}>
                  Change Profile photo
                </button>
              </div>
            </div>
          )}
        </ImageUploading>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="username"
            name="username"
            label="Username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled
          />
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="bio"
            name="bio"
            multiline
            rows={4}
            label="Bio"
            type="text"
            value={formik.values.bio}
            onChange={formik.handleChange}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && formik.errors.bio}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ paddingY: "0.75rem" }}
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangeInfo;
