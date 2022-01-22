import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import {GoogleStrategy} from "./google.strategy";
import {UserModule} from "../user/user.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  controllers: [GoogleController],
  imports: [ConfigModule.forRoot(), JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '180d' }
  }), UserModule],
  providers: [GoogleStrategy, JwtStrategy]
})
export class GoogleModule {}
