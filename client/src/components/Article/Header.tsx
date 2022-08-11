import { ApolloQueryResult } from "@apollo/client";
import { Avatar } from "@mui/material";
import { createContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { GetArticles, GetArticlesProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import SaveButton from "../Profile/SaveButton";
import DisplayDate from "../utils/DisplayDate";
import More from "./More";
import ShareButton from "./ShareButton";

interface HeaderProps {
  data: GetArticles;
  refetch: (
    variables?: Partial<GetArticlesProps> | undefined
  ) => Promise<ApolloQueryResult<GetArticles>>;
}
const headerDefaultValue = {
  isPublish: true,
  publishAt: new Date(),
  refetch: () => {},
};
export const HeaderContext = createContext(headerDefaultValue);
const Header = ({ data, refetch }: HeaderProps) => {
  const { author, _id, saved, readingTime, publishAt, isAuthor, isPublish } =
    data.getArticles.article;

  if (!data) return null;
  return (
    <div className="w-full flex justify-between items-center py-12 px-44">
      <div className="pt-8 flex items-center justify-between  w-full">
        <div className="flex gap-3 items-center">
          <Avatar
            src={author.image}
            alt=""
            className="rounded-[50%] w-12 h-12 object-cover solid-border"
          />
          <div className="flex flex-col">
            <Link
              to={`/u/${author.username}`}
              className="text-black text-xl hover:underline"
            >
              {author.username}
            </Link>
            <div className="flex items-center gap-2">
              <DisplayDate
                date={publishAt}
                title={isPublish ? undefined : "publish at "}
              />
              <span className="text-[#757575]">{readingTime} min read</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isPublish && (
            <>
              <ShareButton />
              <SaveButton id={_id} saved={saved} />
            </>
          )}
          <HeaderContext.Provider value={{ isPublish, publishAt, refetch }}>
            {isAuthor && <More />}
          </HeaderContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default Header;
