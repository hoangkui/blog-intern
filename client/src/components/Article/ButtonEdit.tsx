import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { UpdateArticleMutation } from "../../graphql/mutations";
import { UpdateArticle, UpdateArticleProps } from "../../graphql/types";
import convertDescription from "../../utils/convertDescription";
import LoadingFullScreen from "../utils/LoadingFullScreen";

const ButtonEdit = ({
  data,
  slug,
}: {
  data: {
    title: string;
    body: string;
    description: string;
    tagList: string;
  };
  slug: string;
}) => {
  const navigate = useNavigate();
  const { body, description, tagList, title } = data;
  const [updateArticle, { loading }] = useMutation<
    UpdateArticle,
    UpdateArticleProps
  >(UpdateArticleMutation);
  const handleEdit = async () => {
    const newBody = await convertDescription(body);
    const res = await updateArticle({
      variables: {
        slug,
        input: {
          body: newBody,
          description,
          title,
          tagList,
        },
      },
    });
    if (!res.data) return;

    const { success, article } = res.data.updateArticle;
    if (success) {
      const { slug, _id } = article;
      // write data to caching
      // client.writeFragment({
      //   id: `Article:${_id}`,
      //   fragment: fragments.EditArticle,
      //   data: {
      //     body: newBody,
      //     description,
      //     title,
      //     tagList: tagList ? tagList.split(" ") : [],
      //   },
      // });
      swal("Edit Article success");
      navigate(`/article/${slug}`);
    }
  };
  return (
    <>
      <LoadingFullScreen loading={loading} />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        sx={{ paddingY: "0.75rem" }}
        onClick={handleEdit}
      >
        Edit Article
      </Button>
    </>
  );
};

export default ButtonEdit;
