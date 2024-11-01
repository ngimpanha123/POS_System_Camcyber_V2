// =========================================================================>> Core Library
import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

// ======================================= >> Code Starts Here << ========================== //
@Controller()
export class AppController {
    @Get()
    @Render('main')
    root() {
        return { message: 'CamCyber POS System for FullStack Developer Program' };
    }
}
