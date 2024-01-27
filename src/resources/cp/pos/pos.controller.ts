// =========================================================================>> Core Library
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

// =========================================================================>> Custom Library
import Product from 'src/models/product/product.model';
import Order from 'src/models/order/order.model';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator'; // Typo correction: 'rolse' -> 'roles'
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { User } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';
import { PosService } from './pos.service';
import { CreateOrderDto } from './pos.dto';

// ======================================= >> Code Starts Here << ========================== //

// Applying decorators to the class
@UseGuards(AuthGuard) // ===> Check Authentication (Login or Not)
@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF) // ===> Check Role or Authorization
@Controller('api/pos')
export class PosController {
    constructor(private readonly posService: PosService) { };

    // Handling HTTP GET requests for retrieving products
    @Get('products')
    async getProducts(): Promise<{ data: { id: number, name: string, products: Product[] }[] }> {
        return await this.posService.getProducts();
    }

    // Handling HTTP POST requests for making an order
    @Post('order')
    async makeOrder(@Body() body: CreateOrderDto, @User() payload: UserPayload): Promise<{ data: Order, message: string }> {
        return await this.posService.makeOrder(payload.user.id, body);
    }
}
