import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current.user';
import { CommentsResponse, Profile, SubComment } from 'src/types/ReponseType';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

import { GqlAuthGuard } from './../auth/guards/gql-auth.guard';
import { CommentResponse } from './../types/ReponseType';
import { Comment } from './comment.schema';
import { CommentService } from './comment.service';

const pubSub = new PubSub();
@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  @Subscription(() => CommentResponse, {
    filter: (payload, variables) => {
      return payload.commentAdded.slug === variables.slug;
    },
  })
  commentAdded(@Args('slug') slug: string) {
    const res = pubSub.asyncIterator('commentAdded');

    return res;
  }

  @ResolveField()
  async author(@Parent() comment: { author: string }): Promise<Profile> {
    return this.userService.findUserById(comment.author);
  }

  @Query(() => CommentsResponse)
  async getComment(@Args('slug') slug: string): Promise<CommentsResponse> {
    return await this.commentService.getComment(slug);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentResponse)
  async addComment(
    @CurrentUser() user: User,
    @Args('slug') slug: string,
    @Args('body') body: string,
  ): Promise<CommentResponse> {
    const res = await this.commentService.addComment(slug, body, user._id);
    res.success &&
      (await pubSub.publish('commentAdded', {
        commentAdded: { type: 'add', slug, ...res },
      }));

    return res;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentResponse)
  async deleteComment(
    @CurrentUser() user: User,
    @Args('slug') slug: string,
    @Args('idCmt') idCmt: string,
  ): Promise<CommentResponse> {
    const res = await this.commentService.deleteComment(slug, idCmt, user._id);
    await pubSub.publish('commentAdded', {
      commentAdded: { type: 'rm', slug, ...res },
    });
    return res;
  }
}
