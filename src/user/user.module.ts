import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.entity";
import {ConfigModule} from "@nestjs/config";
import {UserService} from './user.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
