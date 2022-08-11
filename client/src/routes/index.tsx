import { userSelector } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";

import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import Register from "../components/Auth/Register";
import Home from "../components/Home";
import Feed from "../components/Home/Feed";
export const AppRoutes = () => {
  const user = useSelector(userSelector);

  const routes = user.username
    ? [...protectedRoutes, ...publicRoutes]
    : publicRoutes;

  const element = useRoutes(routes);

  return element;
};
