import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RTokenDocument = RToken & Document;

@Schema({
  timestamps: true,
})
@ObjectType()
export class RToken {
  @Field(() => ID) // <-- GraphQL type
  _id: Types.ObjectId; // <-- TypeScript type

  @Field()
  @Prop()
  id: string;

  @Field(() => String)
  @Prop()
  content: string;

  @Field()
  createdAt: Date;
}

export const RTokenSchema = SchemaFactory.createForClass(RToken);
