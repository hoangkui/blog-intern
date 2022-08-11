import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { RTokenModule } from 'src/rtoken/rtoken.module';
import { RTokenService } from 'src/rtoken/rtoken.service';

import { User, UserSchema } from './../user/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    RTokenModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
