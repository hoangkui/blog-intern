import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import * as Scroll from "react-scroll";

const NUM_ONE_PAGE = 5;
export default ({ count }: { count: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initPage = Number(searchParams.get("page")) || 1;
  const { tagName } = useParams();

  const pageMax = Math.ceil(count / NUM_ONE_PAGE);
  const [page, setPage] = useState(initPage);
  useEffect(() => {
    setPage(initPage);
  }, [count, tagName]);

  useEffect(() => {
    if (isNaN(Number(searchParams.get("page"))) || page < 1 || pageMax < 1) {
      searchParams.delete("page");
      setSearchParams(searchParams);
    }
    if (page > pageMax && pageMax > 0) {
      searchParams.set("page", String(pageMax));
      setSearchParams(searchParams);
    }
  }, [page, initPage]);
  if (pageMax <= 1) return null;
  return (
    <Stack spacing={2} className="flex items-center text-3xl">
      <Pagination
        count={pageMax}
        color="primary"
        page={page}
        onChange={async (_, page) => {
          searchParams.set("page", String(page));
          setSearchParams(searchParams);
          setPage(page);
          Scroll.animateScroll.scrollToTop({
            duration: 500,
            delay: 0,
            smooth: true,
          });
        }}
        size="large"
      />
    </Stack>
  );
};
