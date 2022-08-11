import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { storeData, userSelector } from "../store/reducers/userSlice";
import { AiFillSetting, AiOutlineHome } from "react-icons/ai";
import { IoIosCreate } from "react-icons/io";
import { IoCreateOutline, IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import { useMutation } from "@apollo/client";
import { logOutUserMutation } from "../graphql/mutations";
import { memo, useEffect } from "react";
import { parseJwt } from "../utils/refreshToken";
import storage from "../utils/storage";
import { Avatar, Button } from "@mui/material";
import { FiSettings } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
export const defaultDataUser = {
  bio: "",
  createdAt: new Date(),
  email: "",
  image: "",
  token: "",
  username: "",
  refreshToken: "",
};
const Header = () => {
  const [logOut, _] = useMutation<any, { rToken: string }>(logOutUserMutation);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispatch(storeData(defaultDataUser));
    navigate("./login");
    await logOut({
      variables: { rToken: localStorage.getItem("refreshToken") || "" },
    });
    swal("Log out success", "", "success");
    storage.clearToken();
  };
  useEffect(() => {
    if (localStorage.getItem("refreshToken")) {
      const decodedRefresh = parseJwt(
        String(localStorage.getItem("refreshToken"))
      );
      if (Number(decodedRefresh.exp) * 1000 <= Date.now()) {
        storage.clearToken();
        swal("Your session is expire. Please login again");
        navigate("./login");
      }
    } else {
      dispatch(storeData(defaultDataUser));
    }
  }, []);
  return (
    <>
      <div className="fixed top-0 items-center flex justify-between px-56 h-14 w-full  z-[1300] shadow-md bg-white/50 backdrop-blur-xl">
        <Link to="/" className="text-primary font-bold text-3xl">
          HoangNT
        </Link>
        <ul className="flex items-center gap-5 ">
          <Link to="" className="flex justify-center items-center">
            <AiOutlineHome className="mx-1 text-xl" />
            <p>Home</p>
          </Link>

          {user.username === "" ? (
            <>
              <Button
                component={Link}
                to="auth/login/"
                sx={{ textTransform: "none" }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="auth/register"
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <Link
                to="add-article"
                className="flex justify-center items-center"
              >
                <IoCreateOutline className="mx-1 text-xl" />
                <p>New Article</p>
              </Link>
              <Link to="setting" className="flex justify-center items-center">
                <FiSettings className="mx-1 text-xl" />
                <p>Setting</p>
              </Link>
              <Link
                to=""
                onClick={handleLogout}
                className="flex justify-center items-center"
              >
                <IoLogOutOutline className="mx-1 text-xl" />
                <p>Log out</p>
              </Link>
              <Link
                to={`u/${user.username}`}
                className="flex justify-center items-center"
              >
                {user.image ? (
                  <Avatar alt="Remy Sharp" src={user.image} />
                ) : (
                  <p>{user.username}</p>
                )}
              </Link>
            </>
          )}
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
