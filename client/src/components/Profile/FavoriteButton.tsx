import { useMutation } from "@apollo/client";
import debounce from "debounce";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineFavoriteBorder,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { FavoriteArticleMutation } from "../../graphql/mutations";
import { FavoriteArticle, FavoriteArticleProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";

const FavoriteButton = ({
  num,
  isFavorite,
  slug,
}: {
  num: number;
  isFavorite: boolean;
  slug: string;
}) => {
  const [favoriting, setFavoriting] = useState(isFavorite);
  const [favoriteNum, setFavoriteNum] = useState(num);
  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const [favoriteArticle, { loading }] = useMutation<
    FavoriteArticle,
    FavoriteArticleProps
  >(FavoriteArticleMutation);
  const handleFavorite = debounce(async () => {
    if (user.username === "") {
      swal("Login please", "", "warning");
      navigate(
        `/auth/login?redirect=${encodeURIComponent(String(window.location))}`
      );
      return;
    }

    const res = await favoriteArticle({ variables: { slug } });
    if (!res.data?.favoriteArticle.success) {
      swal(String(res.data?.favoriteArticle.message));
      navigate("/", { replace: true });
      return;
    }
    if (favoriting) {
      setFavoriteNum(favoriteNum - 1);
      setFavoriting(false);
      return;
    }
    setFavoriteNum(favoriteNum + 1);
    setFavoriting(true);
  }, 200);
  useEffect(() => {
    setFavoriteNum(num);
    setFavoriting(isFavorite);
  }, [isFavorite]);
  return (
    <button
      className="flex items-center gap-2 text-sm justify-between px-1 hover:opacity-75"
      onClick={handleFavorite}
      disabled={loading}
    >
      {favoriting ? (
        <MdFavorite className="flex items-center gap-1 transition text-xl text-primary" />
      ) : (
        <MdFavoriteBorder className="flex items-center gap-1 transition text-xl text-primary" />
      )}
      <p className="text-[1rem]">{favoriteNum}</p>
    </button>
  );
};

export default FavoriteButton;
