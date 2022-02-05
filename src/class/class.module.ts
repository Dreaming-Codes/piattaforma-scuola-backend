import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Class, ClassSchema} from "./class.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: Class.name, schema: ClassSchema}]),
    ],
})
export class ClassModule {}
