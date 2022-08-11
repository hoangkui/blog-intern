import Fade from "@mui/material/Fade";
import React from "react";

import ArticleSmall from "./ArticleSmall";

const MoreFromAuthor = ({
  data,
  name,
}: {
  data: {
    slug: string;
    title: string;
    description: string;
    img: string;
  }[];
  name: string;
}) => {
  if (!data.length) return null;
  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold text-center">More from {name}</h3>
      <div>
        <div className="px-2 pb-4 border-b-black border-b-solid border-b">
          <Fade in={true} timeout={2000}>
            <div>
              {data.map((item) => (
                <ArticleSmall key={item.slug} data={item} />
              ))}
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default MoreFromAuthor;
