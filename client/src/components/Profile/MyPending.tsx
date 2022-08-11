import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";

import { GET_ARTICLES_PENDING } from "../../graphql/queries";
import { GetArticlesPending } from "../../graphql/types";
import ArticleItem from "./ArticleItem";

const MyPeding = () => {
  const { loading, data } = useQuery<GetArticlesPending>(GET_ARTICLES_PENDING, {
    fetchPolicy: "no-cache",
  });
  // ti lam
  if (loading) return <Skeleton count={15} height={"250px"} />;

  if (
    !data?.getArticlesPending.articles ||
    data?.getArticlesPending.articles.length === 0
  )
    return <h1>No articles are here... yet. </h1>;

  return (
    <>
      {data?.getArticlesPending.articles.map((item, index) => (
        <ArticleItem item={item} key={item.slug} />
      ))}
    </>
  );
};

export default MyPeding;
