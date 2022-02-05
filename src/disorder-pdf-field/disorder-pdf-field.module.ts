import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {DisorderPdfFieldSchema} from "./disorder-pdf-field.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: DisorderPdfFieldModule.name, schema: DisorderPdfFieldSchema}]),
    ],
})
export class DisorderPdfFieldModule {}
