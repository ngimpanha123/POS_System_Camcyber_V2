import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressHandlebars from 'express-handlebars';
import { join } from 'path';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
