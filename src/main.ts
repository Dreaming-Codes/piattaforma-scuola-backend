import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ExpressAdapter, NestExpressApplication} from "@nestjs/platform-express";
import * as cookieParser from 'cookie-parser';
import {json, urlencoded} from "express";
import {graphqlUploadExpress} from "graphql-upload";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
    );
    app.use(graphqlUploadExpress({maxFileSize: 52428800}));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
    await app.listen(3000);
}

bootstrap();
