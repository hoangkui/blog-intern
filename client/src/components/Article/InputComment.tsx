import { useMutation } from "@apollo/client";
import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { AddCommentMutation } from "../../graphql/mutations";
import { AddComment, AddCommentProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";

interface InputCommentProps {
  slug: string;
}
const InputComment = ({ slug }: InputCommentProps) => {
  const [body, setBody] = useState("");

  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const [addComment, { loading }] = useMutation<AddComment, AddCommentProps>(
    AddCommentMutation
  );
  const handlePostComment = async () => {
    if (body === "") {
      swal("Please write somethings");
      return;
    }
    const res = await addComment({ variables: { body, slug } });
    if (!res.data) return;
    const { success, message } = res.data.addComment;
    if (success) {
      setBody("");
      return;
    }
    swal(message, "", "warning");
    navigate("/");
  };

  if (!user.username)
    return (
      <h3>
        Please{" "}
        <Link
          to={`/auth/login?redirect=${encodeURIComponent(
            String(window.location)
          )}`}
          className="underline"
        >
          login
        </Link>{" "}
        to comment
      </h3>
    );
  return (
    <div className="border">
      <div className="">
        <textarea
          name="comment"
          className="w-full max-h-24 p-3"
          rows={4}
          cols={50}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment ..."
        ></textarea>
      </div>
      <div className="w-full bg-[#ccc] px-4 py-2 flex justify-between items-center">
        <div className="flex gap-3 items-center py-2">
          <Avatar src={user.image} alt="" className="w-6 h-6 rounded-[50%]" />
          <Link to={`/u/${user.username}`} className="text-primary">
            {user.username}
          </Link>
        </div>
        <div>
          <button
            className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-md"
            onClick={() => handlePostComment()}
            disabled={loading}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputComment;
