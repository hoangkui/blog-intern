// import { gql } from "graphql-tag";
import { gql } from "@apollo/client";

export const fragments = {
  ArticleData: gql`
    fragment ArticleData on Article {
      _id
      title
      slug
      readingTime
      description
      img
      createdAt
      publishAt
      tagList
      author {
        username
        image
      }
      favoriting
      saved
      favorited {
        username
      }
    }
  `,
  UserData: gql`
    fragment UserData on User {
      email
      username
      bio
      image
      createdAt
    }
  `,
  ResponseBasic: gql`
    fragment ResponseBasic on MutationResponse {
      code
      success
      message
    }
  `,
  EditArticle: gql`
    fragment EditArticle on Article {
      title
      body
      description
      tagList
    }
  `,
};
