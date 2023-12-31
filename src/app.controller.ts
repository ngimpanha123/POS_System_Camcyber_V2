import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('main')
    root() {
        return { message: 'CamCyber POS System' };
    }
}
