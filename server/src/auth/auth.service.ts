import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import {
  generateRefreshToken,
  generateToken,
  responseSuccess,
} from 'src/utils/helper';

import { UserResponse } from '../types/ReponseType';
import { SignInInput } from './../user/user.schema';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return null;
    const isVerifyPassword = compareSync(pass, user.password);

    if (user && isVerifyPassword) return user;
    return null;
  }

  async login(input: SignInInput): Promise<UserResponse> {
    const user = await this.userService.findUserByEmail(input.email);
    const payload = { username: user.username, id: user._id };
    const { email, username, bio, image, createdAt } = user;
    const refreshToken = generateRefreshToken(payload);

    // hash refreshtoken in db
    // await this.userService.updateRefreshToken(user._id, refreshToken);

    return {
      ...responseSuccess('Login success'),
      user: {
        email,
        username,
        bio,
        createdAt,
        image,
      },
      refreshToken,
      accessToken: generateToken(payload),
    };
  }
}
