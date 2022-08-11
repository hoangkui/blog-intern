import { useMutation } from "@apollo/client";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import * as yup from "yup";

import { createArticleMutation } from "../../graphql/mutations";
import { CreateArticle, CreateArticleProps } from "../../graphql/types";
import convertDescription from "../../utils/convertDescription";
import { convertToSlug } from "../../utils/convertToSlug";
import { arrayInput } from "../../utils/static";
import ButtonEdit from "../Article/ButtonEdit";
import LoadingFullScreen from "../utils/LoadingFullScreen";
import Button from "./Button";
import DateTimeValidation from "./DateTimePicker";
import InputTags from "./Tag";
import TextEditor from "./TextEditor";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .min(6, "Description should be of minimum 6 characters length")
    .required("Description is required"),
});
interface NewArticle {
  title: string;
  description: string;
}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function PropsTextField(name: string) {
  return {
    id: `${name}`,
    name: name,
    label: `${capitalizeFirstLetter(name)}`,
  };
}
interface IndexProps {
  data?: {
    title: string;
    description: string;
    tags: string[];
    body: string;
  };
  title?: string;
}
const Index = ({ data }: IndexProps) => {
  const ONE_HOUR = 60000 * 60;
  const [timePublish, setTimePublish] = React.useState<Date | null>(
    new Date(Date.now() + ONE_HOUR)
  );
  const [isSchedule, setIsSchedule] = useState(false);
  const { slug } = useParams();
  const [addArticle] = useMutation<CreateArticle, CreateArticleProps>(
    createArticleMutation
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [body, setBody] = useState(data?.body || "");
  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      description: data?.description || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: NewArticle) => {
      const { description, title } = values;
      setLoading(true);
      const newBody = await convertDescription(body);
      const publishAt = isSchedule ? timePublish || undefined : undefined;
      try {
        const res = await addArticle({
          variables: {
            input: {
              slug: convertToSlug(title),
              body: newBody,
              description,
              tagList: tags.join(" "),
              title,
              publishAt,
            },
          },
        });
        if (!res.data) return;
        const { success, message, article } = res.data.createArticle;
        if (!success) {
          swal(message || "", "", "warning");
          return;
        }
        navigate(`/article/${article.slug}`);
        swal("Publish article success", "created success", "success");
        setTags([]);
        setLoading(false);
      } catch (error) {
        const result = (error as Error).message;
        swal(result, "Token in not valid", "warning");
        setLoading(false);
      }
    },
  });
  useEffect(() => {
    setTimePublish(new Date(Date.now() + ONE_HOUR));
  }, [isSchedule]);
  const conditionDisable = (): boolean => {
    if (!isSchedule) return false;
    if (isNaN(Number(timePublish)) || !timePublish) return true;
    const date = new Date(timePublish).getTime();
    const dateNow = new Date().getTime();
    return date < dateNow;
  };

  return (
    <div className="pt-20 flex items-center w-full justify-center flex-col pb-28">
      <Helmet>
        <title>{data ? "Edit article" : "Add article"}</title>
      </Helmet>
      <LoadingFullScreen loading={loading} />
      <h1 className="box-border text-4xl">
        {data ? "Edit Article" : "Add Your Article"}
      </h1>
      <div className="flex justify-center flex-col gap-8 mt-5">
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            {...PropsTextField("title")}
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            sx={{ marginY: "0.5rem" }}
            fullWidth
            {...PropsTextField("description")}
            multiline
            rows={3}
            type="text"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextEditor
            item={arrayInput[2]}
            value={body}
            onChange={(e) => setBody(e)}
          />
          <div className="w-[720px]">
            <InputTags tags={tags} setTags={setTags} />
          </div>
          {isSchedule && (
            <div className="flex items-center justify-center my-3">
              <DateTimeValidation
                value={timePublish}
                setValue={setTimePublish}
              />
            </div>
          )}
          {data ? (
            <ButtonEdit
              data={{
                body,
                description: formik.values.description,
                tagList: tags.join(" "),
                title: formik.values.title,
              }}
              slug={String(slug)}
            />
          ) : (
            <Button
              condition={conditionDisable()}
              isSchedule={isSchedule}
              setIsSchedule={setIsSchedule}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Index;
