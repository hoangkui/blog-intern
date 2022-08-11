import { Avatar, Fade, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import DisplayDate from "../utils/DisplayDate";
import FavoriteButton from "./FavoriteButton";
import SaveButton from "./SaveButton";

interface ArticleItemProps {
  item: {
    _id: string;
    title: string;
    description: string;
    slug: string;
    readingTime: number;
    publishAt: Date;
    img: string;
    tagList: string[];
    favorited: {
      username: string;
    }[];
    favoriting: boolean;
    saved: boolean;
    author: {
      username: string;
      image: string;
    };
  };
}

const ArticleItem = ({ item }: ArticleItemProps) => {
  const {
    author,
    publishAt,
    title,
    img,
    tagList,
    readingTime,
    _id,
    saved,
    favoriting,
    favorited,
    slug,
    description,
  } = item;
  const { tagName } = useParams();

  const isPublish = new Date(publishAt).getTime() < Date.now();

  const navigate = useNavigate();
  return (
    <div className="pt-6 px-2 py-10 border-b-black border-b-solid border-b my-4">
      <Fade in={true} timeout={2000}>
        <div className="flex justify-between">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="">
                  <Avatar
                    src={author.image}
                    alt=""
                    className="rounded-[50%] w-12 h-12 object-cover solid-border"
                  />
                </div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/u/${author.username}`}
                      className="text-[#292929] hover:underline cursor-pointer text-xl font-semibold"
                    >
                      {author.username}
                    </Link>
                    <DisplayDate
                      date={publishAt}
                      title={isPublish ? undefined : "publish at "}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div
                className="flex items-center cursor-pointer gap-3 justify-between"
                onClick={() => navigate(`/article/${slug}/`)}
              >
                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                    }}
                    className="text-2xl font-bold text-[#292929] my-0 white"
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      fontSize: "1rem",
                      color: "#292929",
                      fontWeight: 400,
                      overflowWrap: "anywhere",
                    }}
                    className="text-sm font-bold text-[#292929] my-0 white"
                  >
                    {description}
                  </Typography>
                </div>
                {img && (
                  <img src={img} className="w-28 h-28 object-contain" alt="" />
                )}
              </div>
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <div>
                    {tagList &&
                      tagList.map((tag) => (
                        <Chip
                          size="small"
                          key={tag}
                          label={tag}
                          color={tag === tagName ? "primary" : "default"}
                          onClick={() => navigate(`/tag/${tag}/`)}
                          className="my-1"
                          sx={{ margin: "4px" }}
                        />
                      ))}
                  </div>
                  <span className="text-[#757575] text-sm">
                    {readingTime} min read
                  </span>
                </div>
                <div className="flex">
                  <SaveButton id={_id} saved={saved} />
                  <FavoriteButton
                    isFavorite={favoriting}
                    num={favorited.length}
                    slug={slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ArticleItem;
