import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/print')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService,) { };
    @Get('order-invoice/:receiptNumber')
    async generateReport(
        @Param('receiptNumber') receiptNumber: number
    ) {
        if (isNaN(receiptNumber)) {
            throw new BadRequestException('Id must be number');
        }
        return this.invoiceService.generateReport(receiptNumber);
    }
}
