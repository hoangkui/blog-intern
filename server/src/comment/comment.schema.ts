import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Profile } from 'src/types/ReponseType';
import { User } from 'src/user/user.schema';
export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Field(() => ID) // <-- GraphQL type
  _id: Types.ObjectId; // <-- TypeScript type

  @Field()
  @Prop()
  body: string;

  @Field(() => Profile)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  author: Types.ObjectId;

  @Field()
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
