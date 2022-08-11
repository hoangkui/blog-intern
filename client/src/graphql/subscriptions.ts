import { gql } from "@apollo/client";

export const COMMENTS_SUBSCRIPTION = gql`
  subscription CommentAdded($slug: String!) {
    commentAdded(slug: $slug) {
      code
      success
      message
      type
      comment {
        body
        author {
          username
          image
        }
        _id
        createdAt
      }
    }
  }
`;
