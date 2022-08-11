import { useMutation } from "@apollo/client";
import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import swal from "sweetalert";
import { ResetPasswordMutation } from "../../graphql/mutations";
import { ResetPasswordDTO } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object({
  pass: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  confirm: yup
    .string()
    .oneOf([yup.ref("pass"), null], "Password Confirm must match")
    .min(6, "Password Confirm should be of minimum 6 characters length")
    .required("Password Confirm is required"),
});
interface UpdatePass {
  pass: string;
  confirm: string;
}

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      pass: "",
      confirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: UpdatePass) => {
      if (!localStorage.getItem("token-reset")) {
        swal("You dont request reset password", "", "warning");
        return;
      }
      try {
        const res = await resetPass({
          variables: {
            pass: values.pass,
            token: localStorage.getItem("token-reset") || "",
          },
        });
        if (!res.data) return;
        if (res.data.resetPassword.success) {
          swal("Reset Password success", "", "success");
          navigate("/auth/login");
        }
      } catch (e: unknown) {
        if (typeof e === "string") {
          swal(e, "", "error");
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          swal(e.message, "", "error");
          localStorage.clear();
        }
      }
    },
  });
  const navigate = useNavigate();
  const [resetPass] = useMutation<
    ResetPasswordDTO,
    { pass: string; token: string }
  >(ResetPasswordMutation);
  const user = useSelector(userSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (user.username) {
      navigate("/", { replace: true });
      return;
    }
    localStorage.getItem("token-reset") ||
      localStorage.setItem("token-reset", searchParams.get("token") || "");
    setSearchParams("");
  }, []);

  if (user.username) return null;
  return (
    <div className="pt-12 flex items-center w-full justify-center flex-col bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
        className="border-solid"
      >
        <div className="w-1/4 bg-white rounded-md shadow-md flex flex-col items-center">
          <h3 className="text-primary text-2xl text-center my-8">
            Change Your Password
          </h3>

          <div className="mx-6">
            <form onSubmit={formik.handleSubmit}>
              <TextField
                sx={{ marginY: "0.5rem" }}
                fullWidth
                id="pass"
                name="pass"
                label="New Password"
                type="password"
                value={formik.values.pass}
                onChange={formik.handleChange}
                error={formik.touched.pass && Boolean(formik.errors.pass)}
                helperText={formik.touched.pass && formik.errors.pass}
              />
              <TextField
                sx={{ marginY: "0.5rem" }}
                fullWidth
                id="confirm"
                name="confirm"
                label="Confirm Password"
                type="password"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                error={formik.touched.confirm && Boolean(formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
              />
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                sx={{ paddingY: "0.75rem" }}
              >
                Save Password
              </Button>
            </form>
          </div>
          <p className="my-4">
            <Link className="underline text-primary" to="/auth/login">
              Log In
            </Link>
            or
            <Link className="underline text-primary" to="/auth/register">
              Sign Up
            </Link>
          </p>
        </div>
      </Grid>
    </div>
  );
};

export default ResetPassword;
