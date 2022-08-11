import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { compareSync, hashSync } from 'bcrypt';
import * as EmailValidator from 'email-validator';
import * as jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { Model, Types } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { UserResponse } from 'src/types/ReponseType';
import { generateToken, generateTokenReset } from 'src/utils/helper';

import { UpdateUserInput } from '../types/InputType';
import { Profile, ProfileResponse } from '../types/ReponseType';
import { SignUpInput, User, UserDocument } from './user.schema';
import { responseSuccess } from '../utils/helper';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL_ADDRESS,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  async checkFollowing(
    idUser: Types.ObjectId,
    idProfile: Types.ObjectId,
  ): Promise<boolean> {
    return (
      (await this.userModel.findOne({
        _id: idUser,
        follow: idProfile,
      })) !== null
    );
  }

  emailNotValid(): UserResponse {
    return {
      code: 400,
      success: false,
      message: 'Email not valid',
    };
  }

  async deleteSaved(id: Types.ObjectId): Promise<void> {
    await this.userModel.updateMany({ saved: id }, { $pull: { saved: id } });
  }
  async updateUser(
    input: UpdateUserInput,
    id: Types.ObjectId,
  ): Promise<UserResponse> {
    const { email, username } = input;

    if (!EmailValidator.validate(email) && email) {
      return this.emailNotValid();
    }

    const exitsUserResponse = await this.checkUpdateUser(username, email, id);
    if (!exitsUserResponse.success) return exitsUserResponse;

    const res = await this.userModel.findByIdAndUpdate(id, input, {
      returnDocument: 'after',
    });
    return {
      ...responseSuccess('User is updated'),
      user: res,
      accessToken: generateToken({ username: res.username, id: id }),
    };
  }
  async changePassword(
    oldpass: string,
    newpass: string,
    id: Types.ObjectId,
  ): Promise<UserResponse> {
    const user = await this.userModel.findById(id);
    const verified = compareSync(oldpass, user.password);
    if (!verified)
      return {
        code: 204,
        success: false,
        message: 'Old Password is not correct',
      };

    const res = await this.userModel.findByIdAndUpdate(
      id,
      {
        password: hashSync(newpass, 10),
      },
      {
        returnDocument: 'after',
      },
    );
    return {
      ...responseSuccess('User is updated'),
      user: res,
      accessToken: generateToken({ username: res.username, id: id }),
    };
  }

  async resetPassword(pass: string, token: string): Promise<UserResponse> {
    const decoded = jwt_decode<{ id: string; mail: string }>(token);
    if (!decoded) throw new BadRequestException('Token is not valid');
    const user = await this.findUserByEmail(decoded.mail);
    const secretKey = `${user.password}-${user.createdAt}`;
    try {
      jwt.verify(token, secretKey);
    } catch (error) {
      throw new BadRequestException(
        'Token is expire or not valid. You should reset password againt',
      );
    }
    await this.userModel.findByIdAndUpdate(decoded.id, {
      password: hashSync(pass, 10),
    });
    return responseSuccess('Reset success');
  }
  async forgotPassword(mail: string): Promise<UserResponse> {
    if (!EmailValidator.validate(mail)) {
      throw new BadRequestException('Email not valid');
    }
    const user = await this.findUserByEmail(mail);

    if (!user) {
      throw new BadRequestException('Email not found');
    }
    const secretKey = `${user.password}-${user.createdAt}`;
    const payload = {
      id: user._id,
      mail: user.email,
    };
    const token = generateTokenReset(payload, '5m', secretKey);
    const forgotLink = `${process.env.URL_CLIENT}/reset?token=${token}`;
    const mailOptions = {
      to: mail,
      subject: 'Reset your Hoangkui password',
      html: `<h3>Hello ${user.username}!</h3>
      <p>Someone (hopefully you) has requested a password reset for your Hoangkui account. Follow the link below to set a new password:</p>
      <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
      <p>If you don't wish to reset your password, disregard this email and no action will be taken.</p>
      `,
    };
    await this.transport.sendMail(mailOptions);
    return responseSuccess('Check your email');
  }
  async checkExitsUser(username: string, email: string): Promise<UserResponse> {
    // check duplicate email
    const existEmail = await this.userModel.findOne({ email });

    if (existEmail) {
      return {
        code: 400,
        success: false,
        message: 'Email has already been taken',
      };
    }
    const existUser = await this.userModel.findOne({ username });
    if (existUser) {
      return {
        code: 400,
        success: false,
        message: 'Username has already been taken',
      };
    }

    return responseSuccess('User not exits');
  }
  async checkUpdateUser(
    username: string,
    email: string,
    id: Types.ObjectId,
  ): Promise<UserResponse> {
    // check duplicate email
    const existEmail = await this.userModel.findOne({ email });
    const existUser = await this.userModel.findOne({ username });
    if (existEmail && !id.equals(existEmail._id)) {
      return {
        code: 400,
        success: false,
        message: 'Email has already been taken',
      };
    }
    if (existUser && !id.equals(existUser._id)) {
      return {
        code: 400,
        success: false,
        message: 'Username has already been taken',
      };
    }

    return responseSuccess('User not exits');
  }
  async signUp(input: SignUpInput): Promise<UserResponse> {
    const { username, email, password } = input;

    if (!EmailValidator.validate(email)) {
      return this.emailNotValid();
    }

    const exitsUserResponse = await this.checkExitsUser(username, email);
    if (!exitsUserResponse.success) return exitsUserResponse;

    // create new user
    const res = await this.userModel.create({
      username,
      email,
      password: hashSync(password, 10),
      expireAt: new Date(),
    });

    // generate token
    const accessToken = generateToken({ username: res.username, id: res.id });

    return {
      ...responseSuccess('One user is created'),
      user: res,
      accessToken,
    };
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
  async findUserById(id: string): Promise<Profile> {
    return await this.userModel.findById(id);
  }

  async findUserByListId(favorited: Types.ObjectId[]): Promise<Profile[]> {
    return await this.userModel.find({ _id: { $in: favorited } });
  }
  async findUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }
  async getUserById(id: Types.ObjectId): Promise<User> {
    return await this.userModel.findById(id);
  }
  async getProfile(username: string): Promise<ProfileResponse> {
    const id = null;
    const res = await this.userModel.findOne({ username });
    // not found
    if (!res) {
      return {
        code: 400,
        success: false,
        message: 'User not found',
      };
    }
    if (!id) {
      return {
        ...responseSuccess('Found'),
        profile: {
          _id: res._id,
          ...res.toObject(),
          following: false,
        },
      };
    }

    return {
      ...responseSuccess('Found'),
      profile: res.toObject(),
    };
  }

  async getProfileById(id: string): Promise<ProfileResponse> {
    const res = await this.userModel.findById(id);
    // not found
    if (!res) {
      return {
        code: 400,
        success: false,
        message: 'User not found',
      };
    }
    return {
      ...responseSuccess('Found'),
      profile: res.toObject(),
    };
  }
  async getfollow(follow: Types.ObjectId[]): Promise<Profile[]> {
    return await this.userModel.find({ _id: { $in: follow } });
  }
  async getfollowUser(follow: Types.ObjectId[]): Promise<User[]> {
    return await this.userModel.find({ _id: { $in: follow } });
  }
  async countFollowers(id: Types.ObjectId): Promise<number> {
    return await this.userModel.find({ follow: id }).count();
  }
  async countFollowing(id: Types.ObjectId): Promise<number> {
    return (await this.userModel.findById(id)).follow.length;
  }
  async getfollowed(id: Types.ObjectId): Promise<Profile[]> {
    return await this.userModel.find({ follow: id });
  }
  async saveArticle(
    idUsername: Types.ObjectId,
    id: string,
  ): Promise<ProfileResponse> {
    const exitSave = await this.userModel.findOne({
      _id: idUsername,
      saved: id,
    });
    exitSave
      ? await this.userModel.findByIdAndUpdate(idUsername, {
          $pull: { saved: id },
        })
      : await this.userModel.findByIdAndUpdate(idUsername, {
          $push: { saved: new Types.ObjectId(id) },
        });
    return responseSuccess(exitSave ? 'Remove save' : 'Save added');
  }
  async checkSaved(
    userId: Types.ObjectId,
    idArticle: Types.ObjectId,
  ): Promise<boolean> {
    const res = await this.userModel.findOne({ _id: userId, saved: idArticle });
    return res !== null;
  }
  async followUser(
    username: string,
    id: Types.ObjectId,
  ): Promise<ProfileResponse> {
    const newFollow = await this.userModel.findOne({ username });
    if (!newFollow) {
      return {
        code: 204,
        success: false,
        message: 'User not found',
      };
    }

    const exitFollowUser = await this.userModel.findOne({
      _id: id,
      follow: newFollow._id,
    });

    exitFollowUser &&
      (await this.userModel.findByIdAndUpdate(id, {
        $pull: { follow: newFollow._id },
      }));

    exitFollowUser ||
      (await this.userModel.findByIdAndUpdate(id, {
        $push: { follow: newFollow._id },
      }));
    if (exitFollowUser) {
      return {
        ...responseSuccess('UnFollowing success'),
        profile: {
          _id: newFollow.id,
          ...newFollow.toObject(),
          following: false,
        },
      };
    }
    return {
      ...responseSuccess('Following success'),
      profile: {
        _id: newFollow.id,
        ...newFollow.toObject(),
        following: true,
      },
    };
  }
}
