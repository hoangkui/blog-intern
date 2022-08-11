import { gql } from "@apollo/client";
import { fragments } from "./fragment";
export const GetListArticlesByAuthorQuery = gql`
  query GetListArticlesByAuthor(
    $author: String!
    $offset: Float!
    $limit: Float!
  ) {
    getListArticlesByAuthor(author: $author, offset: $offset, limit: $limit) {
      code
      success
      message
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
`;
export const GetFavoritedArticlesQuery = gql`
  query GetFavoritedArticles($offset: Float!, $limit: Float!) {
    getFavoritedArticles(offset: $offset, limit: $limit) {
      code
      success
      message
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
`;
export const GET_ARTICLES_PENDING = gql`
  query GetArticlesPending {
    getArticlesPending {
      ...ResponseBasic
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
  ${fragments.ResponseBasic}
`;
export const GET_SAVED_ARTICLE = gql`
  query GetSavedArticles {
    getSavedArticles {
      ...ResponseBasic
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
  ${fragments.ResponseBasic}
`;
export const GetPopularTagsQuery = gql`
  query GetPopularTags {
    getPopularTags {
      ...ResponseBasic
      tag
    }
  }
  ${fragments.ResponseBasic}
`;
export const GetProfileQuery = gql`
  query GetProfile($username: String!) {
    getProfile(username: $username) {
      ...ResponseBasic
      profile {
        _id
        username
        bio
        image
        createdAt
        following
        countFollowing
        countFollowers
        countArticles
        follow {
          username
        }
      }
    }
  }
  ${fragments.ResponseBasic}
`;
export const GET_ARTICLE = gql`
  query GetArticles($slug: String!) {
    getArticles(slug: $slug) {
      code
      success
      message
      article {
        ...EditArticle
        _id
        saved
        slug
        readingTime
        createdAt
        publishAt
        countCmt
        author {
          _id
          username
          following
          image
          countFollowers
          bio
        }
        favoriting
        favorited {
          username
        }
        moreFromAuthor {
          slug
          title
          img
          description
        }
        isAuthor
        isPublish
      }
    }
  }
  ${fragments.EditArticle}
`;
export const GetListArticlesQuery = gql`
  query GetListArticles($limit: Float!, $offset: Float!) {
    getListArticles(limit: $limit, offset: $offset) {
      ...ResponseBasic
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
  ${fragments.ResponseBasic}
`;
export const GetArticlesForYourFeedQuery = gql`
  query GetArticlesForYourFeed($limit: Float!, $offset: Float!) {
    getArticlesForYourFeed(limit: $limit, offset: $offset) {
      ...ResponseBasic
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
  ${fragments.ResponseBasic}
`;
export const GetListArticlesByTagQuery = gql`
  query GetListArticlesByTag($tag: String!, $offset: Float!, $limit: Float!) {
    getListArticlesByTag(tag: $tag, limit: $limit, offset: $offset) {
      ...ResponseBasic
      count
      articles {
        ...ArticleData
      }
    }
  }
  ${fragments.ArticleData}
  ${fragments.ResponseBasic}
`;
export const GetSuggestionQuery = gql`
  query GetSuggestion {
    getSuggestion {
      ...ResponseBasic
      profiles {
        following
        username
        followed {
          username
          following
        }
        image
      }
    }
  }
  ${fragments.ResponseBasic}
`;
export const GET_FOLLOWERS = gql`
  query Profile($id: String!) {
    getProfileById(id: $id) {
      profile {
        followed {
          username
          bio
          image
          following
        }
      }
    }
  }
`;
export const GET_FOLLOWING = gql`
  query GetProfile($username: String!) {
    getProfile(username: $username) {
      code
      success
      message
      profile {
        follow {
          username
          bio
          image
          following
        }
      }
    }
  }
`;
export const GET_COMMENT = gql`
  query GetComment($slug: String!) {
    getComment(slug: $slug) {
      code
      success
      message
      comments {
        _id
        body
        author {
          username
          image
        }
        createdAt
      }
    }
  }
`;
