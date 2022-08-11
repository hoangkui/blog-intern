import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";

import { SIGN_UP } from "../../graphql/mutations";
import { SignUp, SignUpProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import { PropsTextField } from "../AddArticle";
import Layout from "./Layout";

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
  password: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password Confirm must match")
    .min(6, "Password Confirm should be of minimum 6 characters length")
    .required("Password Confirm is required"),
});

interface SignUpData {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

const Register = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema,
    onSubmit: async (values: SignUpData) => {
      const { passwordConfirm, ...data } = values;

      const res = await signUp({
        variables: { input: data },
      });
      if (!res.data) return;
      const { success, message } = res.data.signUp;
      if (!success) {
        swal(message, "", "warning");
        return;
      }
      swal("Register success", ``, "success");
      navigate("/auth/login");
    },
  });
  const { username } = useSelector(userSelector);
  const navigate = useNavigate();
  const [signUp, _] = useMutation<SignUp, SignUpProps>(SIGN_UP);
  useEffect(() => {
    if (username) navigate("/", { replace: true });
  });
  if (username) return null;
  return (
    <Layout title="Register to your account">
      <form onSubmit={formik.handleSubmit}>
        <TextField
          sx={{ marginY: "0.5rem" }}
          fullWidth
          {...PropsTextField("email")}
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          sx={{ marginY: "0.5rem" }}
          fullWidth
          {...PropsTextField("username")}
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          sx={{ marginY: "0.5rem" }}
          fullWidth
          {...PropsTextField("password")}
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          sx={{ marginY: "0.5rem" }}
          fullWidth
          {...PropsTextField("passwordConfirm")}
          label="Password Confirm"
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
          Register
        </Button>
      </form>
    </Layout>
  );
};

export default Register;
