import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressHandlebars from 'express-handlebars';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    /** @EnableCORS */
    app.use(cors());

    /** @useGlobalValidationPipe */
    app.useGlobalPipes(new ValidationPipe({
        /** @noted throw filds that we don't need */
        whitelist: true,
        /** @noted allowed transform data for response */
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    /** Set the limit for request bodies to 50MB*/
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Configure views directory and template engine
    app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
    const hbs = expressHandlebars.create({
        extname: '.html', // Set the extension for your handlebars files
        layoutsDir: join(__dirname, '..', 'src/views')
    });
    app.engine('html', hbs.engine);
    app.setViewEngine('html');

    // Port app running
    await app.listen(1000);
}
bootstrap();
