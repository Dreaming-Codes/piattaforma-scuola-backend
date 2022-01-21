import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.entity";
import {JwtModule} from "@nestjs/jwt";
import {GoogleStrategy} from "./google/google.strategy";
import {ConfigModule} from "@nestjs/config";
import {GoogleModule} from "./google/google.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '180d' },
      }),
      MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
      GoogleModule
  ],
  providers: [UserResolver, UserService, GoogleStrategy]
})
export class UserModule {}
