import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Article } from 'src/article/article.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID) // <-- GraphQL type
  _id: Types.ObjectId; // <-- TypeScript type

  @Field()
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Field()
  @Prop({ default: '' })
  image: string;

  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop({ default: '' })
  bio: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  follow: Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Article.name }],
    default: [],
  })
  saved: Types.ObjectId[];

  @Field()
  @Prop({ default: '' })
  refreshToken: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
