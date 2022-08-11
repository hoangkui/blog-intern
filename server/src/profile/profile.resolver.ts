import { ProfileListResponse } from './../types/ReponseType';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/auth/current.user';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional.guard';
import { Profile, ProfileResponse } from 'src/types/ReponseType';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { responseSuccess } from 'src/utils/helper';
import { ArticleService } from 'src/article/article.service';
import { ModuleRef } from '@nestjs/core';
@Resolver(() => Profile)
export class ProfileResolver implements OnModuleInit {
  private service: ArticleService;

  constructor(
    private readonly userService: UserService, // private articleService: ArticleService,
    private moduleRef: ModuleRef,
  ) {}
  onModuleInit() {
    this.service = this.moduleRef.get(ArticleService, { strict: false });
  }
  @ResolveField()
  async follow(
    @Parent() profile: { follow: Types.ObjectId[] },
  ): Promise<Profile[]> {
    return await this.userService.getfollow(profile.follow);
  }

  @ResolveField()
  async followed(@Parent() profile: Profile): Promise<Profile[]> {
    return await this.userService.getfollowed(profile._id);
  }

  @ResolveField()
  async countFollowers(@Parent() profile: Profile): Promise<number> {
    return await this.userService.countFollowers(profile._id);
  }
  @ResolveField()
  async countFollowing(@Parent() profile: Profile): Promise<number> {
    return profile.follow.length;
  }
  @ResolveField()
  async countArticles(@Parent() profile: Profile): Promise<number> {
    return await this.service.getCountArticles(profile._id);
  }
  @ResolveField()
  async following(
    @Parent() profile: Profile,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    if (!user) return false;
    return await this.userService.checkFollowing(user._id, profile._id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => ProfileResponse)
  async getProfile(
    @CurrentUser() user: User,
    @Args('username') username: string,
  ): Promise<ProfileResponse> {
    return await this.userService.getProfile(username);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => ProfileResponse)
  async getProfileById(@Args('id') id: string): Promise<ProfileResponse> {
    return await this.userService.getProfileById(id);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => ProfileListResponse)
  async getSuggestion(@CurrentUser() user: User): Promise<ProfileListResponse> {
    const listProfile = await this.userService.getfollowUser(user.follow);
    const resArr = listProfile.reduce((pre: Types.ObjectId[], cur) => {
      return [...pre, ...cur.follow];
    }, []);

    const res = (await this.userService.getfollow(resArr)).filter((profile) => {
      const condition =
        profile.username !== user.username &&
        !user.follow.includes(profile._id);
      return condition;
    });

    return {
      ...responseSuccess('Get list suggestion success'),
      profiles: res,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProfileResponse)
  async followUser(
    @CurrentUser() user: User,
    @Args('username') username: string,
  ): Promise<ProfileResponse> {
    return await this.userService.followUser(username, user._id);
  }
}
