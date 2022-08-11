import { useQuery } from "@apollo/client";
import { Avatar, Fade } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { GetSuggestionQuery } from "../../graphql/queries";
import { GetSuggestion } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import Follow from "../User/Follow";
import filterSuggestion from "../utils/filterSuggestion";

export type SuggestionList = {
  following: boolean;
  username: string;
  followed: {
    username: string;
    following: boolean;
  }[];
  image: string;
}[];

const SuggestionUser = () => {
  const user = useSelector(userSelector);
  const { loading, data } = useQuery<GetSuggestion, { username: string }>(
    GetSuggestionQuery,
    {
      variables: { username: user.username },
      fetchPolicy: "no-cache",
    }
  );
  if (loading) return <h3>loading</h3>;
  if (!data) return null;
  const dataFiltered = filterSuggestion(data);
  if (!dataFiltered.length) return null;
  return (
    <Fade in={true} timeout={2000}>
      <div className="mt-6">
        <h1 className="text-[#8e8e8e] text-sm font-semibold mb-5">
          Suggestions For You
        </h1>
        {dataFiltered.map((item) => (
          <div
            className="flex items-center justify-between my-2"
            key={item.username}
          >
            <div className="flex items-center justify-start gap-3">
              <Avatar
                src={item.image}
                alt=""
                className="w-9 h-9 rounded-[50%] border-[1px] border-solid border-[#ccc]"
              />
              <div>
                <Link
                  to={`/u/${item.username}`}
                  className="text-[#262626] font-semibold"
                >
                  {item.username}
                </Link>
                <p className="text-[8e8e8e] text-[12px]">
                  Followed by{" "}
                  <span
                    title={item.followed
                      .map((x) => x.username)
                      .splice(1)
                      .join(" ,")}
                  >
                    {`${item.followed[0].username} ${
                      item.followed.length > 1
                        ? "+" + (item.followed.length - 1).toString() + " more"
                        : ""
                    }`}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <Follow
                data={{ following: item.following, username: item.username }}
              />
            </div>
          </div>
        ))}
      </div>
    </Fade>
  );
};

export default SuggestionUser;
