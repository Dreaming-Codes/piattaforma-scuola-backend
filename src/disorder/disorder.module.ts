import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Disorder, DisorderSchema} from "./disorder.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: Disorder.name, schema: DisorderSchema}]),
    ],
})
export class DisorderModule {}
