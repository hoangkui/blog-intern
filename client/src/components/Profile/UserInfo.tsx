import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../store/reducers/userSlice";
import displayDate from "../../utils/displayDate";
import Follow from "../User/Follow";

const UserInfo = () => {
  // redux
  const user = useSelector(userSelector);

  // navigate
  const navigate = useNavigate();
  return (
    <>
      <div className="pt-12 flex items-center w-full justify-center flex-col pb-28">
        <div className="container bg-[#f3f3f3] w-full h-96 flex items-center justify-center gap-9">
          <div className="">
            <Avatar src={user.image} sx={{ width: "12rem", height: "12rem" }} />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-end gap-4">
              <h1 className="text-4xl mt-3 text-blue-400">{user.username}</h1>
              <Follow data={{ following: true, username: "vcc" }} />
            </div>
            <div className="flex gap-6">
              <p>
                <span className="font-semibold">171</span> articles
              </p>
              <p>
                <span className="font-semibold">20</span> followers
              </p>
              <p>
                <span className="font-semibold">20</span> following
              </p>
            </div>
            <p className="text-[#262626]">{user.bio}</p>
            <div className="flex justify-between w-[70%] items-center">
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
