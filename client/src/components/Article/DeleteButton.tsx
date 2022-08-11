import { useMutation } from "@apollo/client";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { DeleteArticleMutation } from "../../graphql/mutations";
import { DeleteArticle, DeleteArticleProps } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";

const DeleteButton = ({ children }: { children: React.ReactNode }) => {
  const { username } = useSelector(userSelector);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [deleteArticle] = useMutation<DeleteArticle, DeleteArticleProps>(
    DeleteArticleMutation
  );
  const handleDelete = async () => {
    await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this article!",
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteArticle({
          variables: { slug: String(slug) },
        });
        swal("Poof! Your article has been deleted!", {
          icon: "success",
        });
        navigate(`/u/${username}`);
      }
    });
  };
  return (
    <p onClick={handleDelete} className="text-red-500 text-sm">
      {children}
    </p>
  );
};

export default DeleteButton;
