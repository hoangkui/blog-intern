import { Navigate } from "react-router-dom";
import Article from "../components/Article";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ForgotPassword/ResetPassword";
import Header from "../components/Header";
import Home from "../components/Home";
import Feed from "../components/Home/Feed";
import User from "../components/User";
import NotFound from "../utils/NotFound";

export const publicRoutes = [
  {
    path: "",
    element: <Header />,
    children: [
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
      { path: "reset", element: <ResetPassword /> },
      { path: "forgot", element: <ForgotPassword /> },
      { path: "u/:username", element: <User /> },
      { path: "article/:slug", element: <Article /> },
      { path: "auth/register", element: <Register /> },
      {
        path: "",
        element: <Home />,
        children: [
          { path: "all", element: <Feed flag="global" /> },
          { path: "tag/:tagName", element: <Feed flag="tag" /> },
          { index: true, element: <Feed flag="yourfeed" /> },
        ],
      },

      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
