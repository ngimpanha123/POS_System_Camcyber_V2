import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreateOrderDto } from './pos.dto';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { User } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';
import Product from 'src/models/product/product.model';
import Order from 'src/models/order/order.model';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/pos')
export class PosController {
    constructor(private readonly posService: PosService) { };

    @Get('products')
    async getProducts(): Promise<{ data: { id: number, name: string, products: Product[] }[] }> {
        return await this.posService.getProducts();
    }

    @Post('order')
    async makeOrder(@Body() body: CreateOrderDto, @User() payload: UserPayload): Promise<{ data: Order, message: string }> {
        return await this.posService.makeOrder(payload.user.id, body);
    }
}
