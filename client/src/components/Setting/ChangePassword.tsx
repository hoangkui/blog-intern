import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";

import { ChangePasswordMutation } from "../../graphql/mutations";
import { ChangePasswordReturn } from "../../graphql/types";
import { storeData } from "../../store/reducers/userSlice";
import { defaultDataUser } from "../Header";

const validationSchema = yup.object({
  oldpass: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("OldPassword is required"),
  password: yup
    .string()
    .min(6, "New Password should be of minimum 6 characters length")
    .required("New Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password must match")
    .min(6, "Password should be of minimum 6 characters length")
    .required("PasswordConfirm is required"),
});
interface ChangePasswordData {
  oldpass: string;
  password: string;
  passwordConfirm: string;
}

const ChangePassword = () => {
  const formik = useFormik({
    initialValues: {
      oldpass: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: ChangePasswordData) => {
      const { password, oldpass } = values;
      try {
        const res = await callChangePassword({
          variables: { newpass: password, oldpass },
        });
        if (!res.data) return;
        const { success, message } = res.data.changePassword;
        if (!success) {
          swal(message, "", "warning");
          return;
        }
        swal("Change password success", "Please login againt", "success");
        dispatch(storeData(defaultDataUser));
        localStorage.clear();
        navigate("/auth/login");
      } catch (error) {}
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [callChangePassword] = useMutation<
    ChangePasswordReturn,
    { oldpass: string; newpass: string }
  >(ChangePasswordMutation);
  return (
    <div className="flex items-center w-full justify-center flex-col mb-7">
      <div className="flex justify-center flex-col gap-8 mt-5 w-96">
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="oldpass"
            name="oldpass"
            label="Old Password"
            type="password"
            value={formik.values.oldpass}
            onChange={formik.handleChange}
            error={formik.touched.oldpass && Boolean(formik.errors.oldpass)}
            helperText={formik.touched.oldpass && formik.errors.password}
          />
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="password"
            name="password"
            label="New Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            id="passwordConfirm"
            name="passwordConfirm"
            label="New Password Confirm"
            type="password"
            value={formik.values.passwordConfirm}
            onChange={formik.handleChange}
            error={
              formik.touched.passwordConfirm &&
              Boolean(formik.errors.passwordConfirm)
            }
            helperText={
              formik.touched.passwordConfirm && formik.errors.passwordConfirm
            }
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ paddingY: "0.75rem" }}
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
