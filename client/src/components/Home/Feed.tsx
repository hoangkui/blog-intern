import "react-loading-skeleton/dist/skeleton.css";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useTilg from "tilg";

import useQueryArticle from "../../hook/useQueryArticle";
import { userSelector } from "../../store/reducers/userSlice";
import ArticleItem from "../Profile/ArticleItem";
import TextWarning from "../utils/TextWarning";
import Pagination from "./Pagination";

export interface ListArticles {
  code: number;
  success: boolean;
  message: string;
  count: number;
  articles: {
    _id: string;
    title: string;
    slug: string;
    readingTime: number;
    description: string;
    img: string;
    publishAt: Date;
    tagList: string[];
    author: {
      username: string;
      image: string;
    };
    saved: boolean;
    favoriting: boolean;
    favorited: {
      username: string;
    }[];
  }[];
}

const NUM_ONE_PAGE = 5;
const Feed = ({ flag }: { flag: string }) => {
  const navigate = useNavigate();
  const { tagName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { loading, data } = useQueryArticle(
    flag,
    NUM_ONE_PAGE,
    (page - 1) * NUM_ONE_PAGE,
    tagName
  );
  const user = useSelector(userSelector);
  useEffect(() => {
    if (flag === "yourfeed" && !user.username)
      navigate("all", { replace: true });
    if (page < 1) {
      searchParams.delete("page");
      setSearchParams(searchParams);
    }
  });

  if (!data) return null;
  return (
    <div className="mb-20">
      {loading ? (
        <TextWarning>Loading</TextWarning>
      ) : (
        <>
          <div className="mb-4">
            {data?.articles.map((item) => (
              <ArticleItem item={item} key={item.slug} />
            ))}
          </div>
          <Pagination count={data.count} />
          {data.count === 0 && <h1>No articles here</h1>}
        </>
      )}
    </div>
  );
};

export default Feed;
