import Avatar from "@mui/material/Avatar";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { userSelector } from "../../store/reducers/userSlice";
import Followers from "../Article/Followers";
import Follow from "./Follow";
import Following from "./Following";

interface UserInfoProps {
  profile: {
    _id: string;
    username: string;
    bio: string;
    image: string;
    createdAt: Date;
    following: boolean;
    countFollowing: number;
    countFollowers: number;
    countArticles: number;
    follow: {
      username: string[];
    };
  };
}

const UserInfo = ({ profile }: UserInfoProps) => {
  const user = useSelector(userSelector);
  const { _id, image, username, createdAt, following, countArticles, bio } =
    profile;
  const [countFollowers, setCountFollowers] = useState(profile.countFollowers);
  const [countFollowing, setCountFollowing] = useState(profile.countFollowing);
  const changeCountFollowing = (following: boolean, username: string) => {
    following
      ? setCountFollowing((pre) => pre - 1)
      : setCountFollowing((pre) => pre + 1);
  };
  const changeCount = (following: boolean, username: string) => {
    if (username !== profile.username) return;
    following
      ? setCountFollowers((pre) => pre - 1)
      : setCountFollowers((pre) => pre + 1);
  };
  const isMyProfile = user.username === profile.username;
  return (
    <div className="pt-10 flex items-center w-full justify-center flex-col pb-28">
      <div className="container bg-[#f3f3f3] w-full h-96 flex items-center justify-center gap-9">
        <div className="">
          <Avatar src={image} sx={{ width: "12rem", height: "12rem" }} />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex items-end gap-4">
            <h1 className="text-4xl mt-3 text-blue-400">{username}</h1>
            {isMyProfile ? (
              <Link className="text-primary" to={"/setting"}>
                Edit Profile
              </Link>
            ) : (
              <Follow
                data={{ following, username }}
                changeCount={changeCount}
              />
            )}
          </div>
          <div className="flex gap-6">
            <p>
              <span className="font-semibold">{countArticles}</span> articles
            </p>
            <Followers
              idAuthor={_id}
              count={countFollowers}
              changeCount={isMyProfile ? changeCountFollowing : () => {}}
            />
            <Following
              username={username}
              count={countFollowing}
              changeCount={isMyProfile ? changeCountFollowing : () => {}}
            />
          </div>
          <p className="text-[#262626]">{bio}</p>
          <div className="flex justify-between w-[70%] items-center">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
