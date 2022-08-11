import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current.user';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional.guard';
import { Comment } from 'src/comment/comment.schema';
import { CommentService } from 'src/comment/comment.service';
import {
  ArticleListResponse,
  ArticleResponse,
  PopularTagResponse,
  Profile,
} from 'src/types/ReponseType';
import { UserService } from 'src/user/user.service';
import { calculateReadingTime } from 'src/utils/helper';

import { createArticleInput, updateArticleInput } from './../types/InputType';
import { User } from './../user/user.schema';
import { Article } from './article.schema';
import { ArticleService } from './article.service';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
    private userService: UserService,
    private articleService: ArticleService,
  ) {}

  @Query(() => PopularTagResponse)
  async getPopularTags(): Promise<PopularTagResponse> {
    return await this.articleService.getPopularTags();
  }

  @Query(() => PopularTagResponse)
  async getListTag(): Promise<PopularTagResponse> {
    return await this.articleService.getListTag();
  }

  @ResolveField()
  async author(@Parent() article: { author: string }): Promise<Profile> {
    return await this.userService.findUserById(article.author);
  }
  @ResolveField()
  async readingTime(@Parent() article: Article): Promise<number> {
    return calculateReadingTime(article.body);
  }
  @ResolveField()
  async isAuthor(
    @Parent() article: Article,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    if (!user) return false;
    return user._id.equals(article.author);
  }
  @ResolveField()
  async isPublish(@Parent() article: Article): Promise<boolean> {
    return article.publishAt < new Date();
  }
  @ResolveField()
  async moreFromAuthor(@Parent() article: Article): Promise<Article[]> {
    return await this.articleService.moreFromAuthor(article.author);
  }
  @ResolveField()
  async countCmt(@Parent() article: Article): Promise<number> {
    return article.comments.length;
  }
  @ResolveField()
  async img(@Parent() article: Article): Promise<string> {
    const REGEX_IMG = /<img [^>]*src="[^"]*"[^>]*>/gm;
    if (!article.body.match(REGEX_IMG)) return '';
    return article.body.match(REGEX_IMG)[0].split('"')[1] || '';
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async saved(
    @CurrentUser() user: User,
    @Parent() article: Article,
  ): Promise<boolean> {
    return await this.userService.checkSaved(user._id, article._id);
  }

  @ResolveField()
  async comments(@Parent() article: Article): Promise<Comment[]> {
    return this.commentService.getCommentsForArticle(article.comments);
  }
  @ResolveField()
  async favorited(@Parent() article: Article): Promise<Profile[]> {
    return await this.userService.findUserByListId(article.favorited);
  }

  @ResolveField()
  async favoriting(
    @CurrentUser() user: User,
    @Parent() article: Article,
  ): Promise<boolean> {
    return await this.articleService.checkFavoriting(user._id, article._id);
  }

  @Query(() => ArticleListResponse)
  @UseGuards(OptionalJwtAuthGuard)
  async getListArticlesByTag(
    @Args('tag') tag: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getListArticlesByTag(tag, limit, offset);
  }

  @Query(() => ArticleListResponse)
  @UseGuards(OptionalJwtAuthGuard)
  async getListArticlesByAuthor(
    @Args('author') author: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getListArticlesByAuthor(
      author,
      limit,
      offset,
    );
  }

  @Query(() => ArticleListResponse)
  @UseGuards(GqlAuthGuard)
  async getFavoritedArticles(
    @CurrentUser() user: User,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getFavoritedArticles(
      user._id,
      limit,
      offset,
    );
  }

  @Query(() => ArticleListResponse)
  @UseGuards(OptionalJwtAuthGuard)
  async getListArticles(
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getListArticles(limit, offset);
  }

  // authorization
  @Query(() => ArticleListResponse)
  @UseGuards(GqlAuthGuard)
  async getArticlesForYourFeed(
    @CurrentUser() user: User,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getArticlesForYourFeed(
      limit,
      offset,
      user,
    );
  }

  @Query(() => ArticleListResponse)
  @UseGuards(GqlAuthGuard)
  async getArticlesPending(
    @CurrentUser() user: User,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getArticlesPending(user._id);
  }

  @Query(() => ArticleResponse)
  @UseGuards(OptionalJwtAuthGuard)
  async getArticles(
    @Args('slug') slug: string,
    @CurrentUser() user: User,
  ): Promise<ArticleResponse> {
    const responseError = {
      code: 204,
      success: false,
      message: 'The article not found',
    };
    const res = await this.articleService.getArticles(slug);
    if (!res.success) return responseError;
    const isAuthor = user && user._id.equals(res.article.author._id);
    if (res.article.publishAt < new Date() || isAuthor) return res;
    return responseError;
  }

  @Mutation(() => ArticleResponse)
  @UseGuards(GqlAuthGuard)
  async createArticle(
    @CurrentUser() user: User,
    @Args('input') input: createArticleInput,
  ): Promise<ArticleResponse> {
    return await this.articleService.createArticle(input, user._id);
  }

  // authorization
  @Mutation(() => ArticleResponse)
  @UseGuards(GqlAuthGuard)
  async updateArticle(
    @CurrentUser() user: User,
    @Args('input') input: updateArticleInput,
    @Args('slug') slug: string,
  ): Promise<ArticleResponse> {
    return await this.articleService.updateArticle(input, user._id, slug);
  }

  // authorization
  @Mutation(() => ArticleResponse)
  @UseGuards(GqlAuthGuard)
  async deleteArticle(
    @CurrentUser() user: User,
    @Args('slug') slug: string,
  ): Promise<ArticleResponse> {
    const res = await this.articleService.deleteArticle(slug, user._id);
    if (res.success) {
      await this.commentService.deleteCommentArr(res.article.comments);
      await this.userService.deleteSaved(res.article._id);
    }
    return res;
  }

  // authorization
  @Mutation(() => ArticleResponse)
  @UseGuards(GqlAuthGuard)
  async favoriteArticle(
    @CurrentUser() user: User,
    @Args('slug') slug: string,
  ): Promise<ArticleResponse> {
    return await this.articleService.favoriteArticle(slug, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ArticleResponse)
  async saveArticle(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.findById(id);

    if (!article)
      return {
        code: 204,
        success: false,
        message: 'The article was not found!',
      };
    return await this.userService.saveArticle(user._id, id);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => ArticleListResponse)
  async getSavedArticles(
    @CurrentUser() user: User,
  ): Promise<ArticleListResponse> {
    return await this.articleService.getSavedArticles(user.saved);
  }
}
