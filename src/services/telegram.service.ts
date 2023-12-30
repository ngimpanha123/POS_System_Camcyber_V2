import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
    private bot: TelegramBot;

    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    }

    async sendHTMLMessage(htmlText: string) {
        const messageOptions: TelegramBot.SendMessageOptions = {
            parse_mode: 'HTML' as TelegramBot.ParseMode
        };

        await this.bot.sendMessage(process.env.TELEGRAM_CHAT_ID, htmlText, messageOptions);
    }
}