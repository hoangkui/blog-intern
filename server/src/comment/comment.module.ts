import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

import { CommentResolver } from './comment.resolver';
import { Comment, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
