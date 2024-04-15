// =========================================================================>> Core Library
import { Module } from '@nestjs/common';

// =========================================================================>> Custom Library
// External Service
import { TelegramService } from 'src/app/services/telegram.service';

// Custom External Lib
import { PosController } from './pos.controller';
import { PosService } from './pos.service';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [
        PosController
    ],
    providers: [
        PosService,
        TelegramService
    ]
})
export class PosModule { }
