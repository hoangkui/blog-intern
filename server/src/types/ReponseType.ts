import { Article } from '../article/article.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from './MutationResponse';
import { Comment } from 'src/comment/comment.schema';
import { Types } from 'mongoose';

@ObjectType()
class User {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  bio: string;

  @Field()
  image: string;

  @Field({ nullable: true })
  createdAt: Date;
}

@ObjectType({ implements: [MutationResponse] })
export class UserResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}

@ObjectType()
export class Profile {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  username: string;

  @Field()
  bio: string;

  @Field()
  image: string;

  @Field()
  following: boolean;

  @Field(() => [Profile])
  follow: Profile[];

  @Field()
  countFollowers: number;

  @Field()
  countFollowing: number;

  @Field()
  countArticles: number;

  @Field(() => [Profile])
  followed: Profile[];

  @Field()
  createdAt: Date;
}

@ObjectType({ implements: [MutationResponse] })
export class ProfileResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  profile?: Profile;
}

@ObjectType({ implements: [MutationResponse] })
export class ProfileListResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [Profile], { nullable: true })
  profiles?: Profile[];
}

@ObjectType({ implements: [MutationResponse] })
export class ArticleResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Article, { nullable: true })
  article?: Article;
}

@ObjectType({ implements: [MutationResponse] })
export class ArticleListResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  count?: number;

  @Field(() => [Article], { nullable: true })
  articles?: Article[];
}

@ObjectType({ implements: [MutationResponse] })
export class PopularTagResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  tag?: string[];
}

@ObjectType({ implements: [MutationResponse] })
export class CommentsResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];
}
@ObjectType({ implements: [MutationResponse] })
export class CommentResponse implements MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  type?: string;

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@ObjectType()
export class SubComment {
  @Field(() => Comment)
  comment: Comment;

  @Field()
  slug: string;
}
