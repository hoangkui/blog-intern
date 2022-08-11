import { useQuery } from "@apollo/client";
import Chip from "@mui/material/Chip";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useParams } from "react-router-dom";

import { FeedContext } from ".";
import { GetPopularTagsQuery } from "../../graphql/queries";
import { GetPopularTags } from "../../graphql/types";

const Popular = () => {
  const { setTagSelect } = useContext(FeedContext);
  const { tagName } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery<GetPopularTags>(GetPopularTagsQuery, {
    fetchPolicy: "no-cache",
  });
  if (!data) return null;
  return (
    <div className="bg-[#f3f3f3] px-2 pb-3 rounded-md shadow-md mt-8">
      <p className="text-[#373a3c] text-xl">Top 7 Popular Tags</p>
      <div className="flex flex-wrap">
        {loading ? (
          <Skeleton count={5} baseColor="red" />
        ) : (
          data.getPopularTags &&
          data.getPopularTags.tag.map((item) => (
            <Chip
              key={item}
              label={item}
              color={item === tagName ? "primary" : "default"}
              onClick={() => {
                setTagSelect(item);
                navigate(`/tag/${item}/`);
              }}
              className="my-1"
              sx={{ margin: "4px" }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Popular;
