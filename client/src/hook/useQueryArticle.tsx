import { useQuery } from "@apollo/client";

import {
  GetArticlesForYourFeedQuery,
  GetListArticlesByTagQuery,
  GetListArticlesQuery,
} from "../graphql/queries";
import {
  GetArticlesForYourFeed,
  GetArticlesForYourFeedProps,
  GetListArticles,
  GetListArticlesByTag,
  GetListArticlesByTagProps,
  GetListArticlesProps,
} from "../graphql/types";

export default (flag: string, limit: number, offset: number, tag?: string) => {
  if (tag) {
    const { loading, data, refetch } = useQuery<
      GetListArticlesByTag,
      GetListArticlesByTagProps
    >(GetListArticlesByTagQuery, {
      variables: { limit, offset, tag },
      fetchPolicy: "no-cache",
    });

    return {
      loading,
      refetch,
      data: data?.getListArticlesByTag,
    };
  }
  if (flag === "yourfeed") {
    const { loading, data, refetch } = useQuery<
      GetArticlesForYourFeed,
      GetArticlesForYourFeedProps
    >(GetArticlesForYourFeedQuery, {
      variables: { limit, offset },
      fetchPolicy: "no-cache",
    });

    return {
      loading,
      refetch,
      data: data?.getArticlesForYourFeed,
    };
  }

  const { loading, data, refetch } = useQuery<
    GetListArticles,
    GetListArticlesProps
  >(GetListArticlesQuery, {
    variables: { limit, offset },
    fetchPolicy: "no-cache",
  });

  return {
    loading,
    refetch,
    data: data?.getListArticles,
  };
};
