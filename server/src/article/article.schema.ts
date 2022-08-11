import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Comment } from 'src/comment/comment.schema';
import { Profile } from 'src/types/ReponseType';
import { User } from 'src/user/user.schema';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Article {
  @Field(() => ID) // <-- GraphQL type
  _id: Types.ObjectId; // <-- TypeScript type

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  slug: string;

  @Field()
  @Prop()
  body: string;

  @Field(() => Profile)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  author: Types.ObjectId;

  @Field(() => [String])
  @Prop()
  tagList: string[];

  @Field(() => [Profile])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  })
  favorited: Types.ObjectId[];

  @Field(() => [Comment])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }],
  })
  comments: Types.ObjectId[];

  @Field(() => Boolean)
  favoriting: boolean;

  @Field()
  countCmt: number;

  @Field(() => Boolean)
  saved: boolean;

  @Field()
  createdAt: Date;

  @Field(() => [Article], { nullable: true })
  moreFromAuthor: Article[];

  @Field(() => String)
  img: string;

  @Field()
  readingTime: number;

  @Field(() => Date)
  @Prop({ type: Date, default: Date.now })
  publishAt: Date;

  @Field()
  isAuthor: boolean;

  @Field()
  isPublish: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
