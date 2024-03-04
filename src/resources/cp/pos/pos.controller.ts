// =========================================================================>> Core Library
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

// =========================================================================>> Custom Library
import Product from 'src/models/product/product.model';
import Order from 'src/models/order/order.model';
import UserDecorator from 'src/decorators/user.decorator';
import { RolesDecorator, UserRoleDecorator } from 'src/decorators/roles.decorator'; // Typo correction: 'rolse' -> 'roles'
import { PosService } from './pos.service';
import { CreateOrderDto } from './pos.dto';
import User from 'src/models/user/user.model';
import { RoleGuard } from 'src/guards/role.guard';

// ======================================= >> Code Starts Here << ========================== //

@UseGuards(RoleGuard) // Apply the RolesGuard at the controller level to protect all routes of PosController
@RolesDecorator(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF) // ===> Allew Admin and Staff can access all routes of PosController
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
    async makeOrder(@Body() body: CreateOrderDto, @UserDecorator() user: User): Promise<{ data: Order, message: string }> {
        return await this.posService.makeOrder(user.id, body);
    }
}
