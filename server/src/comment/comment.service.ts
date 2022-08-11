import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArticleService } from 'src/article/article.service';
import { CommentResponse, CommentsResponse } from 'src/types/ReponseType';
import { responseSuccess } from 'src/utils/helper';

import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentService implements OnModuleInit {
  private service: ArticleService;
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>, // private readonly articleService: ArticleService,
    private moduleRef: ModuleRef,
  ) {}
  onModuleInit() {
    this.service = this.moduleRef.get(ArticleService, { strict: false });
  }

  async getComment(slug: string): Promise<CommentsResponse> {
    const article = await this.service.getArticles(slug);
    if (!article.success) {
      return {
        code: 204,
        success: false,
        message: 'The article not found',
      };
    }

    const res = await this.commentModel
      .find({
        _id: { $in: article.article.comments },
      })
      .sort({
        createdAt: -1,
      });

    return {
      ...responseSuccess('Get comments success'),
      comments: res,
    };
  }
  async deleteCommentArr(comments: Types.ObjectId[]): Promise<void> {
    await this.commentModel.deleteMany({ _id: { $in: comments } });
  }
  async getCommentsForArticle(comments: Types.ObjectId[]): Promise<Comment[]> {
    const res = await this.commentModel.find({ _id: { $in: comments } }).sort({
      createdAt: -1,
    });
    return res;
  }

  async addComment(
    slug: string,
    body: string,
    id: Types.ObjectId,
  ): Promise<CommentResponse> {
    const existArticle = await this.service.getArticles(slug);

    if (!existArticle.success) {
      return {
        code: 204,
        success: false,
        message: 'Articles has been delete',
      };
    }
    const oneComment = new this.commentModel({
      author: id,
      body,
    });
    const newComment = await oneComment.save();
    const res = await this.commentModel.findById(newComment.id);
    await this.service.addComment(existArticle.article.slug, newComment._id);
    return {
      ...responseSuccess('One comment is add'),
      comment: res,
    };
  }

  async deleteComment(
    slug: string,
    idComment: string,
    id: Types.ObjectId,
  ): Promise<CommentResponse> {
    const existArticle = await this.service.getArticles(slug);
    if (!existArticle) {
      return {
        code: 204,
        success: false,
        message: 'No articles found',
      };
    }
    const comment = await this.commentModel.findById(idComment);
    if (!comment) {
      return {
        code: 204,
        success: false,
        message: 'Id comment not found',
      };
    }
    if (String(comment.author) !== String(id)) {
      return {
        code: 204,
        success: false,
        message: 'You are not allowed',
      };
    }
    const res = await this.commentModel.findByIdAndRemove(comment.id, {
      returnOriginal: true,
    });

    await this.service.deleteComment(existArticle.article.slug, comment._id);
    return { ...responseSuccess('One comment is remove'), comment: res };
  }
}
