// =========================================================================>> Core Library
import { Controller, Get, Post, Put, Delete, ParseIntPipe, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';

// =========================================================================>> Custom Library
import { ProductsTypeService } from './type.service';
import { CreateProductTypeDto, UpdateProductTypeDto } from './type.dto';
import ProductsType from 'src/models/product/type.model';

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
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this.typeService.delete(id);
    }
}
