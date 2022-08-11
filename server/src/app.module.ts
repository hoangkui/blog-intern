import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CommentModule } from './comment/comment.module';
import { RTokenModule } from './rtoken/rtoken.module';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ArticleModule,
    RTokenModule,
    // CommentModule,
    UserModule,
    ProfileModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      cors: {
        // origin: 'http://localhost',
        credentials: true,
      },
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
      debug: false,
      playground: false,
      autoSchemaFile: 'schema.gql',
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        // ApolloServerPluginCacheControl({ defaultMaxAge: 60 }),
      ],
      context: ({ req }) => ({ ...req }),
    }),
    MongooseModule.forRoot(process.env.URL_DATABASE),
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
