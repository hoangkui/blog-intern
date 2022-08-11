import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import usetilg from "tilg";

import { GetListArticlesByAuthorQuery } from "../../graphql/queries";
import {
  GetListArticlesByAuthor,
  GetListArticlesByAuthorProps,
} from "../../graphql/types";
import ArticleItem from "./ArticleItem";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 3;
const MyArticles = ({ username }: { username: string }) => {
  const { loading, data, fetchMore, refetch } = useQuery<
    GetListArticlesByAuthor,
    GetListArticlesByAuthorProps
  >(GetListArticlesByAuthorQuery, {
    variables: {
      author: username,
      limit: LIMIT,
      offset: 0,
    },
    // fetchPolicy: "no-cache",
  });
  useEffect(() => {
    refetch();
  }, []);
  if (loading) return <Skeleton count={15} height={"250px"} />;
  if (!data) return null;
  const { articles, count, message } = data.getListArticlesByAuthor;

  if (articles.length === 0) return <h1>No articles are here... yet. </h1>;

  return (
    <InfiniteScroll
      dataLength={count}
      next={() =>
        fetchMore({
          variables: { offset: count },
        })
      }
      hasMore={message !== "full"}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {articles.map((item) => (
        <ArticleItem item={item} key={item.slug} />
      ))}
    </InfiniteScroll>
  );
};

export default MyArticles;
