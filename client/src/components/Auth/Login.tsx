import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";
import { SIGN_IN } from "../../graphql/mutations.js";
import { SignIn, SignInProps } from "../../graphql/types.js";
import { storeData, userSelector } from "../../store/reducers/userSlice.js";
import storage from "../../utils/storage.js";
import { PropsTextField } from "../AddArticle/index.js";
import Layout from "./Layout.js";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
});

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signIn, _] = useMutation<SignIn, SignInProps>(SIGN_IN);
  const { username } = useSelector(userSelector);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values: LoginData) => {
      try {
        const res = await signIn({
          variables: { input: values },
        });
        if (!res.data) {
          return;
        }
        const { accessToken, refreshToken, user } = res.data.signIn;
        dispatch(storeData(user));
        storage.setToken(accessToken, refreshToken);

        const url = searchParams.get("redirect");
        if (url) {
          const path = decodeURIComponent(url).replace(/^.*\/\/[^\/]+/, "");
          navigate(path);
        } else navigate("/");
      } catch (error) {
        swal("Email or password is not valid", "", "warning");
      }
    },
  });
  useEffect(() => {
    if (username) navigate("/", { replace: true });
  }, []);
  if (username) return null;
  return (
    <Layout title=" Log in to your account 🔐">
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
          {...PropsTextField("password")}
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ paddingY: "0.75rem" }}
        >
          Login
        </Button>
      </form>
      <Link className="underline mt-10" to="/forgot">
        Forgot password?
      </Link>
    </Layout>
  );
};
export default Login;
