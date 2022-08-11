import { useMutation } from "@apollo/client";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import IconButton from "@mui/material/IconButton";
import { debounce } from "debounce";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { SAVE_ARTICLE } from "../../graphql/mutations";
import { SaveArticle } from "../../graphql/types";

interface SaveButtonProps {
  id: string;
  saved: boolean;
}
const SaveButton = (props: SaveButtonProps) => {
  const [saveArticle] = useMutation<SaveArticle, { saveArticleId: string }>(
    SAVE_ARTICLE
  );
  const navigate = useNavigate();
  const [saved, setSaved] = useState(props.saved);
  const handleSave = debounce(async () => {
    try {
      const res = await saveArticle({ variables: { saveArticleId: props.id } });
      if (res.data?.saveArticle.success) {
        setSaved((pre) => !pre);
        return;
      }

      res.data && swal(res.data.saveArticle.message, "", "warning");
      navigate("/", { replace: true });
    } catch (error) {
      swal("Login please", "", "warning");
      navigate(
        `/auth/login?redirect=${encodeURIComponent(String(window.location))}`
      );
    }
  }, 400);
  useEffect(() => {
    setSaved(props.saved);
  }, [props.saved]);
  return (
    <IconButton onClick={() => handleSave()}>
      {saved ? <BookmarkAddedIcon /> : <BookmarkAddedOutlinedIcon />}
    </IconButton>
  );
};

export default SaveButton;
