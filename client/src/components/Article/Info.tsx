import { Avatar } from "@mui/material";
import React, { createContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { userSelector } from "../../store/reducers/userSlice";
import Follow from "../User/Follow";
import Followers from "./Followers";

const infoDefaultValue = {
  changeCount: (x: boolean, y: string) => {},
};
export const InfoContext = createContext(infoDefaultValue);
const Info = ({
  author,
}: {
  author: {
    _id: string;
    username: string;
    following: boolean;
    image: string;
    bio: string;
    countFollowers: number;
  };
}) => {
  const user = useSelector(userSelector);
  const [count, setCount] = useState(author.countFollowers);
  const changeCount = (following: boolean, username: string) => {
    if (username !== author.username) return;
    following ? setCount((pre) => pre - 1) : setCount((pre) => pre + 1);
  };
  return (
    <div className="flex gap-2 mt-20 w-full px-4 flex-col">
      <InfoContext.Provider value={{ changeCount }}>
        <Avatar
          src={author.image}
          sx={{ width: "6rem", height: "6rem" }}
          className="rounded-[50%] shadow-sm"
        />
        <Link
          to={`/u/${author.username}`}
          className="text-[#44393c] text-2xl hover:underline font-medium leading-6 mb-3"
        >
          {author.username}
        </Link>
        <Followers idAuthor={author._id} count={count} />
        <p
          className="text-[#75686b] text-sm leading-5 mb-2"
          style={{ overflowWrap: "anywhere" }}
        >
          {author.bio}
        </p>
        {user.username === author.username ? (
          <Link to="/setting" className="text-blue-500">
            Edit Profile
          </Link>
        ) : (
          <Follow
            data={{
              following: author.following,
              username: author.username,
            }}
            changeCount={changeCount}
          />
        )}
      </InfoContext.Provider>
    </div>
  );
};

export default Info;
