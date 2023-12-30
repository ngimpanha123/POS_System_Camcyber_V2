import { Controller, UseGuards, Get, Query, BadRequestException, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { SaleService } from './sale.service';
import { User } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';

interface GetSaleParams {
    receipt_number?: number;
    created_at?: {
        gte: Date;
        lte: Date;
    };
    cashier_id?: number;
}

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/sales')
export class SaleController {

    constructor(private saleService: SaleService) { };

    @Get()
    listing(
        @User() payload: UserPayload,
        @Query('receipt_number') receipt_number?: number,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        if (from && isNaN(fromDate.getTime())) {
            throw new BadRequestException('Invalid from date');
        }
        if (to && isNaN(toDate.getTime())) {
            throw new BadRequestException('Invalid to date');
        }

        const created_at = from && to ? {
            ...{ gte: fromDate },
            ...{ lte: toDate }
        } : undefined;

        const filters: GetSaleParams = {
            ...(receipt_number && { receipt_number }),
            ...(created_at && { created_at }),
            ...(payload.role === UserRoleDecorator.STAFF && { cashier_id: payload.user.id }), // If Not admin, get only record that this user made orders
        };

        if (isNaN(limit)) {
            limit = 10;
        }
        if (isNaN(page)) {
            page = 1;
        }

        return this.saleService.listing(filters, limit, page);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ status_code: number, message: string }> {
        return await this.saleService.delete(id);
    }
}
