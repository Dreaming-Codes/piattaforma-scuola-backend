import {forwardRef, Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Class, ClassSchema} from "./class.entity";
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: Class.name, schema: ClassSchema}]),
        forwardRef(()=>UserModule)
    ],
    exports: [ClassService],
    providers: [ClassResolver, ClassService],
})
export class ClassModule {}
