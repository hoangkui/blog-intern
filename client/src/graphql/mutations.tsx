import { gql } from "@apollo/client";
// import { gql } from "graphql-tag";

import { fragments } from "./fragment";
export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      ...ResponseBasic
      user {
        ...UserData
      }
      accessToken
      refreshToken
    }
  }
  ${fragments.UserData}
  ${fragments.ResponseBasic}
`;

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ...ResponseBasic
      user {
        ...UserData
      }
      accessToken
    }
  }
  ${fragments.ResponseBasic}
  ${fragments.UserData}
`;
export const updateUserMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...ResponseBasic
      user {
        ...UserData
      }
    }
  }
  ${fragments.UserData}
  ${fragments.ResponseBasic}
`;
export const createArticleMutation = gql`
  mutation CreateArticle($input: createArticleInput!) {
    createArticle(input: $input) {
      ...ResponseBasic
      article {
        ...ArticleData
        favoriting
      }
    }
  }
  ${fragments.ResponseBasic}
  ${fragments.ArticleData}
`;

export const logOutUserMutation = gql`
  mutation LogOut($rToken: String!) {
    LogOut(rToken: $rToken) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;

export const FollowUserMutation = gql`
  mutation FollowUser($username: String!) {
    followUser(username: $username) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;
export const FavoriteArticleMutation = gql`
  mutation FavoriteArticle($slug: String!) {
    favoriteArticle(slug: $slug) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;

export const AddCommentMutation = gql`
  mutation AddComment($slug: String!, $body: String!) {
    addComment(slug: $slug, body: $body) {
      ...ResponseBasic
      comment {
        createdAt
        body
        author {
          username
          image
        }
        _id
      }
    }
  }
  ${fragments.ResponseBasic}
`;
export const DeleteCommentMutation = gql`
  mutation DeleteComment($slug: String!, $idCmt: String!) {
    deleteComment(slug: $slug, idCmt: $idCmt) {
      ...ResponseBasic
      comment {
        body
      }
    }
  }
  ${fragments.ResponseBasic}
`;
export const UpdateArticleMutation = gql`
  mutation UpdateArticle($input: updateArticleInput!, $slug: String!) {
    updateArticle(input: $input, slug: $slug) {
      ...ResponseBasic
      article {
        _id
        slug
        title
        description
        tagList
        body
      }
    }
  }
  ${fragments.ResponseBasic}
`;
export const DeleteArticleMutation = gql`
  mutation DeleteArticle($slug: String!) {
    deleteArticle(slug: $slug) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;
export const ChangePasswordMutation = gql`
  mutation ChangePassword($oldpass: String!, $newpass: String!) {
    changePassword(oldpass: $oldpass, newpass: $newpass) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;
export const ResetPasswordMutation = gql`
  mutation ResetPassword($pass: String!, $token: String!) {
    resetPassword(pass: $pass, token: $token) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($mail: String!) {
    forgotPassword(mail: $mail) {
      ...ResponseBasic
    }
  }
  ${fragments.ResponseBasic}
`;
export const SAVE_ARTICLE = gql`
  mutation SaveArticle($saveArticleId: String!) {
    saveArticle(id: $saveArticleId) {
      code
      success
      message
    }
  }
`;
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      code
      success
      message
      accessToken
      refreshToken
    }
  }
`;
