import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ExpressAdapter, NestExpressApplication} from "@nestjs/platform-express";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
    );
    app.use(cookieParser());
    app.enableCors();
    await app.listen(3000);
}

bootstrap();
