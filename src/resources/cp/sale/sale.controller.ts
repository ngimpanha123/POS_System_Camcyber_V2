// ================================================================>> Core Library
import { Controller, UseGuards, Get, Query, BadRequestException, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';

// ================================================================>> Costom Library
import { RolesDecorator, UserRoleDecorator } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { SaleService } from './sale.service';
import UserDecorator from 'src/decorators/user.decorator';
import { List } from './sale.types';
import User from 'src/models/user/user.model';

interface GetSaleParams {
    receipt_number?: number;
    created_at?: {
        gte: Date;
        lte: Date;
    };
    cashier_id?: number;
}

@RolesDecorator(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(RoleGuard)
@Controller('api/sales')
export class SaleController {

    constructor(private readonly saleService: SaleService) { };

    @Get()
    async listing(
        @UserDecorator() user: User,
        @Query('receipt_number') receipt_number?: number,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ): Promise<List> {

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        if (from && isNaN(fromDate.getTime())) {
            throw new BadRequestException('Invalid from date');
        }
        if (to && isNaN(toDate.getTime())) {
            throw new BadRequestException('Invalid to date');
        }

        const date = from && to ? {
            ...{ gte: fromDate },
            ...{ lte: toDate }
        } : undefined;

        const filters: GetSaleParams = {
            ...(receipt_number && { receipt_number }),
            ...(date && { date }),
            ...(user.type?.name === UserRoleDecorator.STAFF && { cashier_id: user.id }), // If Not admin, get only record that this user made orders
        };

        if (isNaN(limit)) {
            limit = 10;
        }
        if (isNaN(page)) {
            page = 1;
        }

        return await this.saleService.listing(filters, limit, page);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{message: string }> {
        return await this.saleService.delete(id);
    }
}
