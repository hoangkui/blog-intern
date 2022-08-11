import { CommentService } from './../comment/comment.service';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

import { CommentModule } from './../comment/comment.module';
import { ArticleResolver } from './article.resolver';
import { Article, ArticleSchema } from './article.schema';
import { ArticleService } from './article.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    UserModule,
    // forwardRef(() => CommentModule),
    CommentModule,
  ],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
