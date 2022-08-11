import "react-toastify/dist/ReactToastify.css";
import React from "react";
import copy from "copy-to-clipboard";
import { AiOutlineLink } from "react-icons/ai";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { toast, ToastContainer } from "react-toastify";

const ShareButton = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex gap-3">
        <FacebookShareButton
          url={window.location.href}
          hashtag={"#article"}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton title={"article"} url={window.location.href}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <TelegramShareButton title="article" url={window.location.href}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <button
          onClick={() => {
            copy(window.location.href);
            toast.success("Link copied", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }}
          className="rounded-[50%] w-[31px] h-[31px] flex items-center justify-center bg-[#37aee2]"
        >
          <AiOutlineLink className="text-white" />
        </button>
      </div>
    </>
  );
};

export default ShareButton;
