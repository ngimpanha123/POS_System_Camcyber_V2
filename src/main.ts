// =========================================================================>> Core Library
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

// =========================================================================>> Third Party Library
import * as expressHandlebars from 'express-handlebars';
import { join } from 'path';                               //Join all arguments together and normalize the resulting path.
import * as cors from 'cors';                               // Protect Origin Request
import * as bodyParser from 'body-parser';                  // Json Converter 

// =========================================================================>> Custom Library
// Module
import { AppModule } from './app.module';

// ======================================= >> Code Starts Here << ========================== //
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
    const PORT = process.env.PORT || 1000;
    app.listen(PORT, () => {
        // Manually format the date to "MM/DD/YYYY"
        const now = new Date();
        const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        // Determine AM or PM
        const amPm = now.getHours() >= 12 ? 'PM' : 'AM';
        // Convert to 12-hour format
        const hours12 = now.getHours() % 12 || 12; // Converts "0" hours to "12" for 12 AM
        // Format the time with leading zeros and include AM/PM
        const formattedTime = `${hours12.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${amPm}`;
        console.log(`\x1b[32m[Nest] ${process.pid}  - \x1b[37m${formattedDate}, ${formattedTime}     \x1b[32mLOG \x1b[33m[NestApplication] \x1b[32mNest application running on host: \x1b[34mhttp://localhost:${PORT}`);
    });
}
bootstrap();
