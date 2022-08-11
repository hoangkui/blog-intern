import { Drawer, Fade } from "@mui/material";
import React, { createContext, useEffect, useRef, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "./Comment";

import FavoriteButton from "../Profile/FavoriteButton";
import { useLazyQuery } from "@apollo/client";
import { GetComment } from "../../graphql/types";
import { GET_COMMENT } from "../../graphql/queries";
import swal from "sweetalert";
import debounce from "debounce";

const Action = ({
  favoriting,
  favorited,
  countCmt,
}: {
  favoriting: boolean;
  favorited: { username: string }[];
  countCmt: number;
}) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [getComments, { data, loading }] = useLazyQuery<
    GetComment,
    { slug: string }
  >(GET_COMMENT, { fetchPolicy: "no-cache" });
  const [countComment, setCoutComment] = useState(countCmt);
  const [openComment, setOpenComment] = useState(false);
  const { slug } = useParams();
  const handleGetComment = debounce(async () => {
    setOpenComment(true);
    const res = await getComments({ variables: { slug: String(slug) } });
    if (res.data && !res.data.getComment.success) {
      swal(res.data.getComment.message, "", "warning");
      navigate("/", { replace: true });
    }
  }, 200);
  const classInView = inView
    ? "mx-44 flex items-center gap-1 pb-12 my-4"
    : "fixed bottom-0 right-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md solid-border rounded-2xl min-w-[80px] min-h-[40px] bg-white opacity-100 flex items-center cursor-pointer z-10 gap-1 px-4 transition";
  useEffect(() => {
    if (!loading && data) setCoutComment(data.getComment.comments.length);
  }, [data]);
  return (
    <>
      {data && (
        <Drawer
          sx={{ zIndex: 20 }}
          PaperProps={{ sx: { width: 500 } }}
          anchor={"right"}
          open={openComment}
          onClose={() => setOpenComment(false)}
        >
          {loading ? (
            <h1>Loading ...</h1>
          ) : (
            <Comment
              comments={data.getComment.comments}
              slug={String(slug)}
              setCoutComment={setCoutComment}
            />
          )}
        </Drawer>
      )}
      <div ref={ref}></div>
      <Fade in={true} timeout={1000}>
        <div className={classInView}>
          <div>
            <FavoriteButton
              isFavorite={favoriting}
              num={favorited.length}
              slug={String(slug)}
            />
          </div>
          <div className="h-3 mx-4 border-r border-solid border-[rgb(230, 230, 230)]"></div>
          <div
            className="flex items-center justify-between gap-2 hover:opacity-50 cursor-pointer"
            onClick={handleGetComment}
          >
            <FaRegComment />
            <span>{countComment}</span>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Action;
