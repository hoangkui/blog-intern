import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import useTilg from "tilg";

import { GET_SAVED_ARTICLE } from "../../graphql/queries";
import { GetSavedArticles } from "../../graphql/types";
import ArticleItem from "./ArticleItem";

const MySaved = ({ username }: { username: string }) => {
  //   redux
  const { loading, data } = useQuery<GetSavedArticles>(GET_SAVED_ARTICLE);
  useTilg();
  // ti lam
  if (loading) return <Skeleton count={15} height={"250px"} />;
  if (
    !data?.getSavedArticles.articles ||
    data?.getSavedArticles.articles.length === 0
  )
    return <h1>No articles are here... yet. </h1>;

  return (
    <>
      {data?.getSavedArticles.articles.map((item, index) => (
        <ArticleItem item={item} key={item.slug} />
      ))}
    </>
  );
};

export default MySaved;
