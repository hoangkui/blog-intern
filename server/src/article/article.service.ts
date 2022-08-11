import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Number, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { responseSuccess } from 'src/utils/helper';

import {
  ArticleListResponse,
  ArticleResponse,
  PopularTagResponse,
} from '../types/ReponseType';
import { createArticleInput, updateArticleInput } from './../types/InputType';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly userService: UserService,
  ) {}

  async findById(id: string): Promise<Article> {
    return this.articleModel.findById(id);
  }

  async moreFromAuthor(id: Types.ObjectId): Promise<Article[]> {
    const articles = await this.articleModel
      .aggregate([
        { $match: { author: id } },
        {
          $unwind: {
            path: '$favorited',
            // preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            doc: { $first: '$$ROOT' },
            favorited: { $push: '$favorited' },
            size: { $sum: 1 },
          },
        },
        { $sort: { size: -1 } },
        { $replaceRoot: { newRoot: '$doc' } },
      ])
      .limit(5);

    return articles;
  }
  async getPopularTags(): Promise<PopularTagResponse> {
    const listPopular = await this.articleModel
      .aggregate([
        { $unwind: '$tagList' },
        { $group: { _id: { tag: '$tagList' }, count: { $sum: 1 } } },
        { $project: { _id: 0, tag: '$_id.tag', count: 1 } },
        { $sort: { count: -1 } },
      ])
      .limit(7);
    const res = listPopular.map((item) => item.tag);
    return {
      ...responseSuccess('Get success popular tag'),
      tag: res,
    };
  }
  async getListTag(): Promise<PopularTagResponse> {
    const res = await this.articleModel.distinct('tagList');
    return {
      ...responseSuccess('Get list tag success'),
      tag: res.filter((item) => item !== null),
    };
  }
  async getCountArticles(id: Types.ObjectId): Promise<number> {
    return await this.articleModel.find({ author: id }).count();
  }

  async checkFavoriting(
    idUser: Types.ObjectId,
    id: Types.ObjectId,
  ): Promise<boolean> {
    const res = await this.articleModel.findOne({
      _id: id,
      favorited: idUser,
    });
    return Boolean(res);
  }

  async getListArticlesByTag(
    tag: string,
    limit: number,
    offset: number,
  ): Promise<ArticleListResponse> {
    const res = await this.articleModel
      .find({ tagList: tag, publishAt: { $lt: Date.now() } })
      .skip(offset)
      .limit(limit)
      .sort({ publishAt: -1 });
    const count = await this.articleModel
      .find({ tagList: tag, publishAt: { $lt: Date.now() } })
      .count();
    return {
      ...responseSuccess(`Get articles by tag ${tag}`),
      count,
      articles: res,
    };
  }
  async getSavedArticles(arr: Types.ObjectId[]): Promise<ArticleListResponse> {
    const res = await this.articleModel.find({
      _id: arr,
      publishAt: { $lt: Date.now() },
    });
    return {
      ...responseSuccess(`Get saved articles`),
      articles: res,
    };
  }

  async getListArticlesByAuthor(
    author: string,
    limit: number,
    offset: number,
  ): Promise<ArticleListResponse> {
    const userAuthor = await this.userService.findUserByUsername(author);
    if (!userAuthor) {
      return {
        code: 204,
        success: false,
        message: 'Author not found',
      };
    }
    const res = await this.articleModel
      .find({ author: userAuthor._id, publishAt: { $lt: Date.now() } })
      .skip(offset)
      .limit(limit)
      .sort({
        publishAt: -1,
      });
    return {
      ...responseSuccess(`Get articles by author ${author}`),
      articles: res,
      count: res.length,
    };
  }
  async getFavoritedArticles(
    id: Types.ObjectId,
    limit: number,
    offset: number,
  ): Promise<ArticleListResponse> {
    const res = await this.articleModel
      .find({ favorited: id, publishAt: { $lt: Date.now() } })
      .skip(offset)
      .limit(limit)
      .sort({
        publishAt: -1,
      });
    return {
      ...responseSuccess('Get favorited articles'),
      articles: res,
      count: res.length,
    };
  }
  async getListArticles(
    limit: number,
    offset: number,
  ): Promise<ArticleListResponse> {
    const res = await this.articleModel
      .find({ publishAt: { $lt: Date.now() } })
      .skip(offset)
      .limit(limit)
      .sort({ publishAt: -1 });
    const count = await this.articleModel.find().count();

    return {
      ...responseSuccess(`Get articles by limit ${limit}`),
      count,
      articles: res,
    };
  }
  async getArticlesForYourFeed(
    limit: number,
    offset: number,
    user: User,
  ): Promise<ArticleListResponse> {
    const res = await this.articleModel
      .find({
        author: { $in: user.follow },
        publishAt: { $lt: Date.now() },
      })
      .skip(offset)
      .limit(limit)
      .sort({ publishAt: -1 });
    const count = await this.articleModel
      .find({
        author: { $in: user.follow },
        publishAt: { $lt: Date.now() },
      })
      .count();

    return {
      ...responseSuccess('get your feed article success'),
      count,
      articles: res,
    };
  }
  async getArticlesPending(id: Types.ObjectId): Promise<ArticleListResponse> {
    const res = await this.articleModel
      .find({
        author: { $in: id },
        publishAt: { $gt: Date.now() },
      })
      .sort({ publishAt: -1 });

    return {
      ...responseSuccess('get your feed article success'),
      count: res.length,
      articles: res,
    };
  }
  async getArticles(slug: string): Promise<ArticleResponse> {
    const res = await this.articleModel.findOne({ slug });
    if (!res) {
      return {
        code: 204,
        success: false,
        message: 'No articles found',
      };
    }
    return {
      ...responseSuccess('get single article'),
      article: res,
    };
  }

  async addComment(slug: string, cmtId: Types.ObjectId): Promise<void> {
    await this.articleModel.findOneAndUpdate(
      { slug },
      {
        $push: { comments: cmtId },
      },
    );
  }
  async deleteComment(slug: string, cmtId: Types.ObjectId): Promise<void> {
    await this.articleModel.findOneAndUpdate(
      { slug },
      {
        $pull: { comments: cmtId },
      },
    );
  }
  async createArticle(
    input: createArticleInput,
    id: Types.ObjectId,
  ): Promise<ArticleResponse> {
    const { body, description, tagList, title, publishAt, slug } = input;
    const tagArray = tagList ? tagList.split(' ') : [];

    if (publishAt && Number(publishAt) < Date.now())
      return {
        code: 204,
        success: false,
        message: 'Invalid pushlish time',
      };
    const newArticleObject = new this.articleModel({
      title,
      description,
      slug,
      body,
      author: id,
      tagList: tagArray,
      publishAt,
    });
    const newArticle = await newArticleObject.save();

    return {
      ...responseSuccess('One article is created'),
      article: newArticle,
    };
  }

  async updateArticle(
    input: updateArticleInput,
    id: Types.ObjectId,
    slug: string,
  ): Promise<ArticleResponse> {
    const { body, description, tagList, title, publishAt } = input;

    const tagArray = tagList ? tagList.split(' ') : [];

    const res = await this.articleModel.findOne({ slug });
    if (!res) {
      return {
        code: 204,
        success: false,
        message: 'No articles found',
      };
    }

    if (String(res.author) !== String(id)) {
      return {
        code: 204,
        success: false,
        message: 'You are not allowed',
      };
    }
    if (new Date(publishAt).getTime() < new Date().getTime()) {
      return {
        code: 204,
        success: false,
        message: 'Invalid time',
      };
    }
    if (new Date(res.publishAt).getTime() < new Date().getTime()) {
      return {
        code: 204,
        success: false,
        message: 'The article has been published',
      };
    }
    const updated = await this.articleModel.findByIdAndUpdate(
      res._id,
      {
        title,
        description,
        body,
        tagList: tagArray,
        publishAt,
      },
      { new: true },
    );
    return {
      ...responseSuccess('Article is updated'),
      article: updated,
    };
  }
  async deleteArticle(
    slug: string,
    id: Types.ObjectId,
  ): Promise<ArticleResponse> {
    const res = await this.articleModel.findOne({ slug });
    if (!res) {
      return {
        code: 204,
        success: false,
        message: 'No articles found',
      };
    }

    if (String(res.author) !== String(id)) {
      return {
        code: 204,
        success: false,
        message: 'You are not allowed',
      };
    }

    await this.articleModel.findOneAndRemove({ slug });

    return { ...responseSuccess('Article is deleted'), article: res };
  }
  async favoriteArticle(
    slug: string,
    id: Types.ObjectId,
  ): Promise<ArticleResponse> {
    const findArticle = await this.articleModel.findOne({
      slug,
    });
    if (!findArticle) {
      return {
        code: 204,
        success: false,
        message: 'The article not found ',
      };
    }

    // check favorited
    const favorited = await this.articleModel.findOne({ slug, favorited: id });

    const res = favorited
      ? await this.articleModel.findOneAndUpdate(
          { slug },
          {
            $pull: { favorited: id },
          },
          {
            new: true,
          },
        )
      : await this.articleModel.findOneAndUpdate(
          { slug },
          {
            $push: { favorited: id },
          },
          { new: true },
        );

    return {
      ...responseSuccess(favorited ? 'UnFavorite success' : 'Favorite success'),
      article: res,
    };
  }
}
