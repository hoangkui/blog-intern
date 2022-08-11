import { Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailValidator from "email-validator";
import swal from "sweetalert";
import { FORGOT_PASSWORD } from "../../graphql/mutations";
import { ForgotPassword } from "../../graphql/types";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/reducers/userSlice";
const Index = () => {
  const [forgotPass] = useMutation<ForgotPassword, { mail: string }>(
    FORGOT_PASSWORD
  );
  const [submited, setSubmited] = useState(false);
  const [mail, setMail] = useState("");
  const handleSubmit = async () => {
    if (!EmailValidator.validate(mail)) {
      swal("Email not valid");
      return;
    }
    try {
      await forgotPass({ variables: { mail } });
      setSubmited(true);
    } catch (error) {
      swal("Email is not registered", "", "warning");
    }
  };
  const navigate = useNavigate();
  const { username } = useSelector(userSelector);
  useEffect(() => {
    if (username) navigate("/", { replace: true });
  });
  if (username) return null;
  return (
    <div className="pt-12 flex items-center w-full justify-center flex-col bg-[#5F478A]">
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
          <h3 className="text-[#664986] text-3xl text-center my-8 font-light">
            Reset password
          </h3>
          {submited ? (
            <p className="px-4 text-[#b24603] pb-12">
              Check your inbox for the next steps. If you don't receive an
              email, and it's not in your spam folder this could mean you signed
              up with a different address.
            </p>
          ) : (
            <>
              <p className="text-sm px-4 text-[#2d3748] mb-6">
                Enter your email address below and we'll send you a link to
                reset your password.
              </p>
              <div className="my-2">
                <TextField
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>

              <button
                className="py-3 px-24 rounded-md my-4 text-white hover:opacity-90 bg-[#664986]"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
              <p className="my-4">
                <Link className="underline text-[#664986]" to="/auth/login">
                  Log In
                </Link>
                or
                <Link className="underline text-[#664986]" to="/auth/register">
                  Sign Up
                </Link>
              </p>
            </>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default Index;
