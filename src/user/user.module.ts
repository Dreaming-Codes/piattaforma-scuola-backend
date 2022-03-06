import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.entity";
import {ConfigModule} from "@nestjs/config";
import {UserService} from './user.service';
import { UserResolver } from './user.resolver';
import {ClassModule} from "../class/class.module";
import {EventEmitter2} from "@nestjs/event-emitter";
import {UserListener} from "./user.listener";
import * as mongoosastic from "mongoosastic"

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeatureAsync([{
            name: User.name,
            useFactory (eventEmitter: EventEmitter2) {
                const schema = UserSchema;

                //TODO: Usare per la ricerca elasticsearch
                UserSchema.plugin(mongoosastic)

                schema.pre('deleteMany', async function (next) {
                    const usersToDelete = await eventEmitter.emitAsync(User.name + ':deleteMany', {
                        originalQuery: this.getQuery()
                    });
                    this.setQuery({
                        _id: {
                            $in: usersToDelete.flat()
                        }
                    });
                    next();
                });
                schema.pre("deleteOne", (next) => {
                    const userToDelete = eventEmitter.emitAsync(User.name + ':deleteOne', {
                        originalQuery: this.getQuery()
                    });
                    this.setQuery({
                        _id: userToDelete
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
