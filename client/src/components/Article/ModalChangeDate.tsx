import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useEffect, useState } from "react";
import { HeaderContext } from "./Header";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import DateTimePicker from "../AddArticle/DateTimePicker";
import { useMutation } from "@apollo/client";
import { UpdateArticle, UpdateArticleProps } from "../../graphql/types";
import { UpdateArticleMutation } from "../../graphql/mutations";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import swal from "sweetalert";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

const ModalChangeDate = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { isPublish, publishAt, refetch } = useContext(HeaderContext);
  const [value, setValue] = useState<Date | null>(publishAt);
  const [updateArticle, { loading }] = useMutation<
    UpdateArticle,
    UpdateArticleProps
  >(UpdateArticleMutation);
  const handleUpdate = async () => {
    const publishAt = value ? value : undefined;
    const res = await updateArticle({
      variables: {
        slug: String(slug),
        input: {
          publishAt,
        },
      },
    });
    if (!res.data) return;
    setOpen(false);
    if (res.data.updateArticle.success) {
      swal("Change success", "", "success");
      refetch();
      return;
    }
    swal(res.data.updateArticle.message, "", "warning");
    refetch();
  };
  useEffect(() => {
    setValue(publishAt);
  }, [open]);
  const condition = (): boolean => {
    if (isNaN(Number(value)) || !value) return true;
    const date = new Date(value).getTime();
    const dateInit = new Date(publishAt).getTime();
    const dateNow = new Date().getTime();
    return date === dateInit || date < dateNow;
  };
  if (isPublish) return null;
  return (
    <>
      <MenuItem>
        <p className="text-sm justify-center" onClick={handleOpen}>
          Change Publish Time
        </p>
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex-col flex justify-center gap-3">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Publish Time
          </Typography>
          <DateTimePicker value={value} setValue={setValue} />
          <LoadingButton
            onClick={handleUpdate}
            loading={loading}
            loadingIndicator="Loading…"
            variant="outlined"
            disabled={condition()}
          >
            Change
          </LoadingButton>
        </Box>
      </Modal>
    </>
  );
};

export default ModalChangeDate;
