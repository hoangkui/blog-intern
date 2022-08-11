import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RToken, RTokenSchema } from './rtoken.schema';
import { RTokenService } from './rtoken.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RToken.name, schema: RTokenSchema }]),
  ],
  providers: [RTokenService],
  exports: [RTokenService],
})
export class RTokenModule {}
