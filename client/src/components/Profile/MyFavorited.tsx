import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { GetFavoritedArticlesQuery } from "../../graphql/queries";
import {
  GetFavoritedArticles,
  GetListArticlesProps,
} from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import ArticleItem from "./ArticleItem";
import useTilg from "tilg";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 3;

const MyFavorited = ({ username }: { username: string }) => {
  const { loading, data, fetchMore, refetch } = useQuery<
    GetFavoritedArticles,
    GetListArticlesProps
  >(GetFavoritedArticlesQuery, {
    variables: {
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
  const { articles, count, message } = data.getFavoritedArticles;

  if (data.getFavoritedArticles.articles.length === 0)
    return <h1 className="my-10">No articles are here... yet. </h1>;

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

export default MyFavorited;
