import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import DeleteButton from "./DeleteButton";
import ModalChangeDate from "./ModalChangeDate";

const More = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FiMoreHorizontal />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/article/${String(slug)}/edit/`);
          }}
        >
          <p className="text-sm">Edit Article</p>
        </MenuItem>
        <MenuItem>
          <DeleteButton>Delete Article</DeleteButton>
        </MenuItem>
        <ModalChangeDate />
      </Menu>
    </>
  );
};

export default More;
