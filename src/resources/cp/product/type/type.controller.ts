import { Controller, Get, Post, Put, Delete, UseGuards, ParseIntPipe, Param, Body, HttpCode } from '@nestjs/common';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { ProductsTypeService } from './type.service';
import { CreateProductTypeDto, UpdateProductTypeDto } from './type.dto';
import ProductsType from 'src/models/product/type.model';

@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/products/type')
export class ProductsTypeController {
    constructor(private typeService: ProductsTypeService) { };

    @Get()
    async listing(): Promise<{ data: { id: number, name: string, n_of_products: number }[] }> {
        return await this.typeService.listing();
    }

    @Post()
    async create(@Body() body: CreateProductTypeDto): Promise<{ data: ProductsType, message: string }> {
        return await this.typeService.create(body);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductTypeDto,
    ): Promise<any> {
        return this.typeService.update(body, id);
    }

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param('id') id: number): Promise<{ status_code: number, message: string }> {
        return await this.typeService.delete(id);
    }
}
