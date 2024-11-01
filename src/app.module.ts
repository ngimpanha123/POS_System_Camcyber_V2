import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './services/telegram.service';
import { FileService } from './services/file.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TelegramService, FileService],
})
export class AppModule {}
