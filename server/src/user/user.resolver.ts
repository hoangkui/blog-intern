import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/current.user';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { RTokenService } from 'src/rtoken/rtoken.service';
import { UpdateUserInput } from 'src/types/InputType';
import { JwtPayload } from 'src/types/JwtPayload';
import { UserResponse } from 'src/types/ReponseType';
import {
  generateRefreshToken,
  generateToken,
  responseSuccess,
} from 'src/utils/helper';

import { SignInInput, SignUpInput, User } from './user.schema';
import { UserService } from './user.service';

@Resolver(() => UserResponse)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private rtService: RTokenService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse)
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(input, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse)
  async changePassword(
    @CurrentUser() user: User,
    @Args('oldpass') oldpass: string,
    @Args('newpass') newpass: string,
  ): Promise<UserResponse> {
    return await this.userService.changePassword(oldpass, newpass, user._id);
  }

  @Mutation(() => UserResponse)
  async forgotPassword(@Args('mail') mail: string): Promise<UserResponse> {
    return this.userService.forgotPassword(mail);
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Args('pass') pass: string,
    @Args('token') token: string,
  ): Promise<UserResponse> {
    return this.userService.resetPassword(pass, token);
  }

  @Mutation(() => UserResponse)
  async signUp(@Args('input') input: SignUpInput) {
    return await this.userService.signUp(input);
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => UserResponse)
  async signIn(@Args('input') input: SignInInput) {
    const res = await this.authService.login(input);
    await this.rtService.create(res.refreshToken);
    return res;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserResponse)
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponse> {
    return {
      ...responseSuccess('Get current user success'),
      user: user,
      accessToken: generateToken({
        username: user.username,
        id: user._id,
      }),
    };
  }

  @Mutation(() => UserResponse)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<UserResponse> {
    if (!jwt.verify(refreshToken, process.env.REFRESH_KEY)) {
      throw new ForbiddenException('Refresh token malformed');
    }
    const { username, id } = jwtDecode<JwtPayload>(refreshToken);

    if (!(await this.rtService.find(refreshToken))) {
      throw new ForbiddenException('Access Denied');
    }

    const user = await this.userService.getUserById(id);

    const newRefreshToken = generateRefreshToken({ username, id });
    await this.rtService.findAndUpdate(refreshToken, newRefreshToken);

    return {
      ...responseSuccess('RefreshToken success'),
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        createdAt: user.createdAt,
      },
      refreshToken: newRefreshToken,
      accessToken: generateToken({ username, id }),
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse)
  async LogOut(@CurrentUser() user: User, @Args('rToken') rToken: string) {
    await this.rtService.delete(rToken);
    return responseSuccess('Log out success');
  }
}
