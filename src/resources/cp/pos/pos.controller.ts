// =========================================================================>> Core Library
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

// =========================================================================>> Custom Library
// Model
import Product from 'src/models/product/product.model';
import Order from 'src/models/order/order.model';

// Middleware
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { User } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';

// External Lib
import { PosService } from './pos.service';
import { CreateOrderDto } from './pos.dto';


// ======================================= >> Code Starts Here << ========================== //

@UseGuards(AuthGuard) // ===> Check Authentication (Login or Not)
@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF) // ===> Check Role or Aurthorization

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
