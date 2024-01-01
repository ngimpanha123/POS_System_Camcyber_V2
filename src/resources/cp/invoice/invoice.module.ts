import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { JsReportService } from 'src/services/js-report.service';

@Module({
    controllers: [InvoiceController],
    providers: [InvoiceService, JsReportService],
    imports: []
})
export class InvoiceModule { }
