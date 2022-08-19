import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  username: string;
}

@InputType()
export class createArticleInput {
  @Field()
  slug: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  body: string;

  @Field()
  tagList: string;

  @Field({ nullable: true })
  publishAt?: Date;
}

@InputType()
export class updateArticleInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  body: string;

  @Field({ nullable: true })
  tagList: string;

  @Field({ nullable: true })
  publishAt: Date | undefined;
}
