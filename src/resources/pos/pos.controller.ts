import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreateOrderDto } from './pos.dto';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { User } from 'src/middleware/decorators/user.decorator';
import { UserPayload } from 'src/middleware/interceptors/auth.interceptor';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/pos')
export class PosController {
    constructor(private readonly posService: PosService) { };

    @Get('products')
    async getProducts() {
        return await this.posService.getProducts();
    }

    @Post('order')
    async makeOrder(
        @Body() body: CreateOrderDto,
        @User() payload: UserPayload
    ) {
        return await this.posService.makeOrder(payload.user.id, body);
    }
}
