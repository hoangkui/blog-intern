import { Suspense } from "react";
import { Navigate } from "react-router-dom";

import AddArticle from "../components/AddArticle";
import EditArticle from "../components/Article/EditArticle";
import Header from "../components/Header";
import Setting from "../components/Setting";

export const protectedRoutes = [
  {
    path: "",
    element: <Header />,
    children: [
      { path: "add-article", element: <AddArticle /> },
      { path: "article/:slug/edit/", element: <EditArticle /> },
      { path: "setting", element: <Setting /> },
      { path: "*", element: <Navigate to="" /> },
    ],
  },
];
