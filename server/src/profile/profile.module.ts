import { ArticleService } from './../article/article.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';

import { User, UserSchema } from '../user/user.schema';
import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [ProfileResolver, UserService],
  exports: [],
})
export class ProfileModule {}
