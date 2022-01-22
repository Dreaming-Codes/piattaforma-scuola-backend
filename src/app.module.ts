import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {GraphQLModule} from "@nestjs/graphql";
import {MongooseModule} from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import {GoogleModule} from "./google/google.module";

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot("mongodb://localhost:27017/test"), GraphQLModule.forRoot({
    autoSchemaFile: true,
    installSubscriptionHandlers: true,
    playground: true,
    debug: false
  }), UserModule, GoogleModule],
  providers: [AppService, AppResolver],
})
export class AppModule {}
