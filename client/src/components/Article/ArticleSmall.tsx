import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleSmall = ({
  data,
}: {
  data: {
    slug: string;
    title: string;
    img: string;
    description: string;
  };
}) => {
  const { slug, title, img, description } = data;
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-between items-start my-6 cursor-pointer"
      onClick={() => navigate(`/article/${slug}/`)}
    >
      <div className="w-full flex">
        <div className="flex items-start flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="overflow-hidden text-ellipsis leading-5 max-h-10">
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  overflowWrap: "anywhere",
                }}
                className="text-sm font-bold text-[#292929] my-0 white"
              >
                {title}
              </Typography>
            </div>
          </div>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              fontSize: "0.8rem",
              color: "#7e7e7e",
              fontWeight: 400,
              overflowWrap: "anywhere",
            }}
            className="text-sm font-bold text-[#292929] my-0 white"
          >
            {description}
          </Typography>
        </div>
        {img !== "" && (
          <img src={img} className="w-24 h-24 object-contain" alt="" />
        )}
      </div>
    </div>
  );
};

export default ArticleSmall;
