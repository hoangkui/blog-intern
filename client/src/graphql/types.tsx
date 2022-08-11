export interface SignInProps {
  input: {
    email: string;
    password: string;
  };
}
export interface SignIn {
  signIn: {
    code: number;
    success: boolean;
    message: string;
    user: {
      email: string;
      username: string;
      bio: string;
      image: string;
      createdAt: Date;
    };
    refreshToken: string;
    accessToken: string;
  };
}

export interface SignUpProps {
  input: {
    email: string;
    password: string;
    username: string;
  };
}
export interface SignUp {
  signUp: {
    code: number;
    success: boolean;
    message: string;
    user: {
      refreshToken: string;
      username: string;
      image: string;
      bio: string;
      email: string;
      createdAt: Date;
    };
    accessToken: string;
  };
}

export interface UpdateUserProps {
  input: {
    email: string;
    username: string;
    bio: string;
    image?: string;
  };
}
export interface UpdateUser {
  updateUser: {
    code: number;
    success: boolean;
    message: string;
    user: {
      username: string;
      image: string;
      bio: string;
      email: string;
      createdAt: Date;
    };
  };
}

export interface CreateArticleProps {
  input: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string;
    publishAt?: Date;
  };
}
export interface CreateArticle {
  createArticle: {
    code: number;
    success: boolean;
    message: string;
    article: {
      title: string;
      description: string;
      slug: string;
      body: string;
      createdAt: Date;
      publishAt: Date;
      tagList: string;
      author: {
        username: string;
        image: string;
      };
      favorited: {
        username: string;
      }[];
      favoriting: boolean;
      saved: boolean;
    };
  };
}
export interface GetListArticlesByAuthorProps {
  author: string;
  limit: number;
  offset: number;
}
export interface GetListArticlesByAuthor {
  getListArticlesByAuthor: {
    code: number;
    message: string;
    success: boolean;
    count: number;
    articles: {
      _id: string;
      title: string;
      slug: string;
      description: string;
      readingTime: number;
      img: string;
      createdAt: Date;
      publishAt: Date;
      tagList: string[];
      favorited: {
        username: string;
      }[];
      saved: boolean;
      favoriting: boolean;
      author: {
        username: string;
        image: string;
      };
    }[];
  };
}

export interface GetFavoritedArticles {
  getFavoritedArticles: {
    code: number;
    success: boolean;
    message: string;
    count: number;
    articles: {
      _id: string;
      title: string;
      slug: string;
      readingTime: number;
      img: string;
      description: string;
      createdAt: Date;
      publishAt: Date;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface GetSavedArticles {
  getSavedArticles: {
    code: number;
    success: boolean;
    message: string;
    articles: {
      _id: string;
      title: string;
      slug: string;
      description: string;
      readingTime: number;
      img: string;
      publishAt: Date;
      createdAt: Date;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface GetPopularTags {
  getPopularTags: {
    success: boolean;
    message: string;
    tag: string[];
  };
}
export interface GetProfileProps {
  username: string;
}
export interface GetProfile {
  getProfile: {
    code: number;
    success: boolean;
    message: string;
    profile: {
      _id: string;
      username: string;
      bio: string;
      image: string;
      countFollowing: number;
      countFollowers: number;
      countArticles: number;
      createdAt: Date;
      following: boolean;
      follow: {
        username: string[];
      };
    };
  };
}
export interface GetFollowing {
  getProfile: {
    code: number;
    success: boolean;
    message: string;
    profile: {
      follow: {
        username: string;
        bio: string;
        image: string;
        following: boolean;
      }[];
    };
  };
}
export interface FollowUserProps {
  username: string;
}
export interface FollowUser {
  followUser: {
    success: boolean;
    message: string;
    code: number;
  };
}
export interface FavoriteArticleProps {
  slug: string;
}
export interface FavoriteArticle {
  favoriteArticle: {
    success: boolean;
    message: string;
    code: number;
  };
}
export interface UnFavoriteArticleProps {
  slug: string;
}
export interface UnFavoriteArticle {
  unFavoriteArticle: {
    code: number;
    success: boolean;
    message: string;
  };
}
export interface GetArticlesProps {
  slug: string;
}
export interface GetArticles {
  getArticles: {
    code: number;
    success: boolean;
    message: string;
    article: {
      _id: string;
      title: string;
      description: string;
      slug: string;
      body: string;
      readingTime: number;
      publishAt: Date;
      createdAt: Date;
      tagList: string[];
      countCmt: number;
      author: {
        _id: string;
        username: string;
        following: boolean;
        image: string;
        bio: string;
        countFollowers: number;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
      moreFromAuthor: {
        slug: string;
        title: string;
        description: string;
        img: string;
      }[];
      isAuthor: boolean;
      isPublish: boolean;
    };
  };
}
export interface AddCommentProps {
  slug: string;
  body: string;
}
export interface AddComment {
  addComment: {
    success: boolean;
    message: string;
    code: number;
    comment: {
      createdAt: Date;
      body: string;
      _id: string;
      author: {
        username: string;
        image: string;
      };
    };
  };
}
export interface DeleteCommentProps {
  slug: string;
  idCmt: string;
}
export interface DeleteComment {
  deleteComment: {
    success: boolean;
    message: string;
    code: number;
    comment: {
      body: string;
    };
  };
}
export interface UpdateArticleProps {
  input: {
    title?: string;
    description?: string;
    body?: string;
    tagList?: string;
    publishAt?: Date;
  };
  slug: string;
}
export interface UpdateArticle {
  updateArticle: {
    success: boolean;
    message: string;
    code: number;
    article: {
      _id: string;
      slug: string;
      title: string;
      description: string;
      tagList: string;
      body: string;
    };
  };
}
export interface GetListArticlesProps {
  limit: number;
  offset: number;
}
export interface GetListArticles {
  getListArticles: {
    code: number;
    success: boolean;
    message: string;
    count: number;
    _id: string;
    articles: {
      _id: string;
      title: string;
      slug: string;
      description: string;
      img: string;
      createdAt: Date;
      publishAt: Date;
      readingTime: number;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface GetArticlesForYourFeedProps {
  limit: number;
  offset: number;
}
export interface GetArticlesForYourFeed {
  getArticlesForYourFeed: {
    code: number;
    success: boolean;
    message: string;
    count: number;
    articles: {
      _id: string;
      title: string;
      slug: string;
      description: string;
      img: string;
      readingTime: number;
      createdAt: Date;
      publishAt: Date;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface GetListArticlesByTagProps {
  limit: number;
  offset: number;
  tag: string;
}
export interface GetListArticlesByTag {
  getListArticlesByTag: {
    code: number;
    success: boolean;
    message: string;
    count: number;
    articles: {
      _id: string;
      title: string;
      slug: string;
      readingTime: number;
      description: string;
      img: string;
      publishAt: Date;
      createdAt: Date;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface GetArticlesPending {
  getArticlesPending: {
    code: number;
    success: boolean;
    message: string;
    count: number;
    articles: {
      _id: string;
      title: string;
      slug: string;
      readingTime: number;
      description: string;
      img: string;
      publishAt: Date;
      createdAt: Date;
      tagList: string[];
      author: {
        username: string;
        image: string;
      };
      saved: boolean;
      favoriting: boolean;
      favorited: {
        username: string;
      }[];
    }[];
  };
}
export interface SingleArticle {
  title: string;
  slug: string;
  body: string;
  readingTime: number;
  publishAt: Date;
  createdAt: Date;
  tagList: string[];
  author: {
    username: string;
    image: string;
  };
  saved: boolean;
  favoriting: boolean;
  favorited: {
    username: string;
  }[];
}

export interface DeleteArticleProps {
  slug: string;
}
export interface DeleteArticle {
  deleteArticle: {
    success: string;
    message: string;
    code: number;
  };
}

export interface GetSuggestion {
  getSuggestion: {
    code: number;
    success: string;
    message: string;
    profiles: {
      following: boolean;
      username: string;
      followed: {
        username: string;
        following: boolean;
      }[];
      image: string;
    }[];
  };
}
export interface ChangePasswordReturn {
  changePassword: {
    code: number;
    success: boolean;
    message: string;
  };
}
export interface ResetPasswordDTO {
  resetPassword: {
    code: number;
    success: string;
    message: string;
  };
}
export interface ForgotPassword {
  forgotPassword: {
    code: number;
    success: boolean;
    message: string;
  };
}
export interface SaveArticle {
  saveArticle: {
    code: number;
    success: boolean;
    message: string;
  };
}
export interface Articles {
  code: number;
  message: string;
  success: boolean;
  count: number;
  articles: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    readingTime: number;
    img: string;
    publishAt: Date;
    createdAt: Date;
    tagList: string[];
    favorited: {
      username: string;
    }[];
    saved: boolean;
    favoriting: boolean;
    author: {
      username: string;
      image: string;
    };
  }[];
}
export interface GetFollowers {
  getProfileById: {
    profile: {
      followed: {
        username: string;
        bio: string;
        image: string;
        following: boolean;
      }[];
    };
  };
}
export interface GetComment {
  getComment: {
    code: number;
    success: boolean;
    message: string;
    comments: {
      _id: string;
      body: string;
      author: {
        username: string;
        image: string;
      };
      createdAt: Date;
    }[];
  };
}
export interface RefreshTokenResponse {
  refreshToken: {
    code: number;
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}
