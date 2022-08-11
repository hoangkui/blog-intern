import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import { DeleteCommentMutation } from "../../graphql/mutations";
import { GET_COMMENT } from "../../graphql/queries";
import { COMMENTS_SUBSCRIPTION } from "../../graphql/subscriptions";
import {
  DeleteComment,
  DeleteCommentProps,
  GetComment,
} from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import DisplayDate, { DisplayDateComment } from "../utils/DisplayDate";
import InputComment from "./InputComment";

interface CommentProps {
  comments: {
    _id: string;
    createdAt: Date;
    author: {
      username: string;
      image: string;
    };
    body: string;
  }[];
  slug: string;
  setCoutComment: React.Dispatch<React.SetStateAction<number>>;
}
interface CommentAdded {
  commentAdded: {
    code: number;
    success: boolean;
    message: string;
    type: string;
    comment: {
      body: string;
      author: {
        username: string;
        image: string;
      };
      _id: string;
      createdAt: Date;
    };
  };
}
interface Comment {
  _id: string;
  createdAt: Date;
  author: {
    username: string;
    image: string;
  };
  body: string;
}
const Comment = ({ comments, slug, setCoutComment }: CommentProps) => {
  if (!comments) return null;
  const [deleteComment] = useMutation<DeleteComment, DeleteCommentProps>(
    DeleteCommentMutation
  );
  const [listComments, setListComments] = useState<Comment[]>(comments);

  const user = useSelector(userSelector);

  const handleDelete = async (id: string) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this comment!",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteComment({ variables: { idCmt: id, slug } });
      }
    });
  };

  const subComment = useSubscription<CommentAdded, { slug: string }>(
    COMMENTS_SUBSCRIPTION,
    { variables: { slug } }
  );

  useEffect(() => {
    const { data } = subComment;

    if (data && data.commentAdded.type === "add") {
      setListComments((pre) => [data.commentAdded.comment, ...pre]);
      setCoutComment((pre) => pre + 1);
    }
    if (data && data.commentAdded.type === "rm") {
      const idRemove = data.commentAdded.comment._id;
      setListComments((pre) => [...pre.filter((pre) => pre._id !== idRemove)]);
      setCoutComment((pre) => pre - 1);
    }
  }, [subComment.data]);

  return (
    <div className="my-16 px-4 w-full">
      <h3 className="text-2xl text-center font-semibold mb-3">
        {listComments.length} Reponses
      </h3>

      <InputComment slug={slug} />
      <div className="mt-3">
        {listComments.length > 0 && (
          <Paper style={{ padding: "40px 20px" }}>
            {listComments?.map((comment) => (
              <div key={comment._id}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar alt="Remy Sharp" src={comment.author.image} />
                  </Grid>
                  <Grid justifyContent="left" item xs zeroMinWidth>
                    <Link
                      to={`/u/${comment.author.username}`}
                      className="m-0 text-left font-semibold text-xl hover:underline"
                    >
                      {comment.author.username}
                    </Link>
                    <Typography
                      sx={{
                        textAlign: "left",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {comment.body}
                    </Typography>
                    <DisplayDateComment date={comment.createdAt} />
                  </Grid>
                  <Grid justifyContent="center" alignItems="center">
                    {user.username === comment.author.username && (
                      <div onClick={() => handleDelete(comment._id)}>
                        <p className="cursor-pointer text-red-500">
                          <BsFillTrashFill />
                        </p>
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
              </div>
            ))}
          </Paper>
        )}
      </div>
    </div>
  );
};

export default Comment;
