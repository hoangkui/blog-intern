import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { GET_ARTICLE } from "../../graphql/queries";
import { GetArticles, GetArticlesProps } from "../../graphql/types";
import NotFound from "../../utils/NotFound";
import LoadingFullScreen from "../utils/LoadingFullScreen";
import Action from "./Action";
import Content from "./Content";
import Header from "./Header";
import Info from "./Info";
import MoreFromAuthor from "./MoreFromAuthor";

const Index = () => {
  const { slug } = useParams();
  const { loading, data, refetch } = useQuery<GetArticles, GetArticlesProps>(
    GET_ARTICLE,
    {
      variables: {
        slug: String(slug),
      },
      fetchPolicy: "no-cache",
    }
  );
  if (loading) return <LoadingFullScreen loading={loading} />;
  if (!data) return null;
  if (!data.getArticles.success) return <NotFound />;

  const {
    tagList,
    body,
    title,
    author,
    favorited,
    favoriting,
    countCmt,
    moreFromAuthor,
    isPublish,
    description,
  } = data.getArticles.article;
  // if()
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Nested component" />
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <div
            style={{ minHeight: "100vh" }}
            className="border-r border-black border-solid"
          >
            <Header data={data} refetch={refetch} />
            <Content
              body={body}
              title={title}
              listTag={tagList}
              description={description}
            />
            {isPublish && (
              <Action
                favoriting={favoriting}
                favorited={favorited}
                countCmt={countCmt}
              />
            )}
          </div>
        </Grid>
        <Grid item xs={3}>
          <Info author={author} />
          <MoreFromAuthor
            data={moreFromAuthor.filter((item) => item.slug !== slug)}
            name={author.username}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
