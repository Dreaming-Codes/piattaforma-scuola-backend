import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.entity";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '180d' },
      }),
      MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  providers: [UserResolver, UserService, JwtStrategy]
})
export class UserModule {}
