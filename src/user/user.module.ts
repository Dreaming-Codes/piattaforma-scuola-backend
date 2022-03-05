import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.entity";
import {ConfigModule} from "@nestjs/config";
import {UserService} from './user.service';
import { UserResolver } from './user.resolver';
import {ClassModule} from "../class/class.module";
import {EventEmitter2} from "@nestjs/event-emitter";
import {UserListener} from "./user.listener";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeatureAsync([{
            name: User.name,
            useFactory (eventEmitter: EventEmitter2) {
                const schema = UserSchema;
                schema.pre('deleteMany', async function (next) {
                    const originalQuery = this.getQuery();
                    const usersToDelete = await eventEmitter.emitAsync(User.name + ':deleteMany', {
                        originalQuery
                    });
                    this.setQuery({
                        _id: {
                            $in: usersToDelete.flat()
                        }
                    });
                    next();
                });
                return schema;
            },
            inject: [EventEmitter2]
        }]),
        ClassModule
    ],
    providers: [UserService, UserResolver, UserListener],
    exports: [UserService],
})
export class UserModule {
}
