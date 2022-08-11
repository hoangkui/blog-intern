import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { GET_ARTICLE } from "../../graphql/queries";
import { GetArticles, GetArticlesProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import NotFound from "../../utils/NotFound";
import AddArticle from "../AddArticle";
import LoadingFullScreen from "../utils/LoadingFullScreen";

const EditArticle = () => {
  const user = useSelector(userSelector);
  const { slug } = useParams();
  const { loading, data } = useQuery<GetArticles, GetArticlesProps>(
    GET_ARTICLE,
    {
      variables: { slug: String(slug) },
      //  fetchPolicy: "no-cache"
    }
  );
  if (loading) return <LoadingFullScreen loading={loading} />;
  if (!data) return null;
  const isAuthor = data.getArticles.article.author.username === user.username;
  if (!data.getArticles.success || !isAuthor) return <NotFound />;
  const { title, body, description, tagList } = data.getArticles.article;

  return (
    <AddArticle
      data={{
        title,
        body,
        description,
        tags: tagList,
      }}
    />
  );
};

export default EditArticle;
