import React, { createContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import { storeData, userSelector } from "../../store/reducers/userSlice";
import { defaultDataUser } from "../Header";
import Nav from "./Nav";
import Popular from "./Popular";
import SuggestionUser from "./SuggestionUser";
export const FeedContext = createContext<{
  tagSelect: string;
  setTagSelect: React.Dispatch<React.SetStateAction<string>>;
}>({ tagSelect: "", setTagSelect: () => {} });

const Index = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken") && user.username !== "") {
      dispatch(storeData(defaultDataUser));
    }
  });

  return (
    <>
      <Helmet>
        <title>HoangNT Blog</title>
      </Helmet>
      <div className="pt-16 px-[16%] grid grid-cols-5 scroll-smooth">
        <div className="mt-4 pr-3 col-span-3">
          <div>
            <Nav />
          </div>
          <Outlet />
        </div>
        <div className="ml-10">
          <div className="fixed w-[20%]">
            <Popular />
            {user.username && <SuggestionUser />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
