import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { TelegramService } from 'src/services/telegram.service';

@Module({
    controllers: [PosController],
    providers: [PosService, TelegramService]
})
export class PosModule {}
