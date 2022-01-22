import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import {GoogleStrategy} from "./google.strategy";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [GoogleController],
  imports: [UserModule],
  providers: [GoogleService, GoogleStrategy]
})
export class GoogleModule {}
