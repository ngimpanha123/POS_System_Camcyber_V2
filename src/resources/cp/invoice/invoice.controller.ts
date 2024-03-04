// ================================================================>> Core Library
import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';

// ================================================================>> Costom Library
import { InvoiceService } from './invoice.service';
import { RolesDecorator, UserRoleDecorator } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';

// Applying decorators to the class
@RolesDecorator(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(RoleGuard)
@Controller('api/print')

export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { };

    // Handling HTTP GET requests for generating an invoice report
    @Get('order-invoice/:receiptNumber')
    async generateReport(@Param('receiptNumber') receiptNumber: number) {
        // Checking if the receiptNumber is a valid number
        if (isNaN(receiptNumber)) {
            throw new BadRequestException('Id must be a number');
        }
        // Calling the generateReport method of the injected InvoiceService
        return this.invoiceService.generateReport(receiptNumber);
    }
}
