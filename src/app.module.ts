import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {GraphQLModule} from "@nestjs/graphql";
import {MongooseModule} from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import {GoogleModule} from "./google/google.module";
import { ClassModule } from './class/class.module';
import { DisorderModule } from './disorder/disorder.module';
import { DisorderPdfFieldModule } from './disorder-pdf-field/disorder-pdf-field.module';
import {join} from 'path';
import {EventEmitterModule} from "@nestjs/event-emitter";

@Module({
  imports: [ConfigModule.forRoot(), EventEmitterModule.forRoot(), MongooseModule.forRoot("mongodb://localhost:27017/test"), GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'schema.gql'),
    installSubscriptionHandlers: true,
    playground: true,
    debug: false
  }), UserModule, GoogleModule, ClassModule, DisorderModule, DisorderPdfFieldModule],
  providers: [AppService, AppResolver],
})
export class AppModule {}
