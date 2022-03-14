import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {Disorder, DisorderSchema} from "./disorder.entity";
import { DisorderResolver } from './disorder.resolver';
import { DisorderService } from './disorder.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name: Disorder.name, schema: DisorderSchema}]),
    ],
    providers: [DisorderResolver, DisorderService],
})
export class DisorderModule {}
