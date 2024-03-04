// ================================================================>> Core Library
import { Controller, Get, Post, Param, ParseIntPipe, Query, UsePipes, Body, Put, Delete, BadRequestException } from '@nestjs/common';

// ================================================================>> Costom Library
import { ProductService } from './product.service';
import { ProductsTypeExistsPipe } from 'src/pipes/product.pipe';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';

@Controller('api/products')
export class ProductController {

    constructor(private productService: ProductService) { };

    // Endpoint to perform setup operations, retrieving product types
    @Get('setup')
    async setup(): Promise<{ data: ProductsType[] }> {
        return await this.productService.setup();
    }

    // Endpoint to list products with optional filtering and pagination
    @Get()
    async listing(
        @Query('key') key?: string,
        @Query('type_id') type_id?: number,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        // Set default values if not provided
        if (!limit) {
            limit = 10;
        }
        if (!page) {
            page = 1;
        }

        return await this.productService.listing(type_id, key, limit, page);
    }

    // Endpoint to create a new product
    @Post()
    @UsePipes(ProductsTypeExistsPipe)
    async create(@Body() body: CreateProductDto): Promise<{ data: Product, message: string }> {
        return await this.productService.create(body);
    }

    // Endpoint to update an existing product
    @Put(':id')
    @UsePipes(ProductsTypeExistsPipe)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto
    ) {
        return this.productService.update(body, id);
    }

    // Endpoint to delete an existing product
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return await this.productService.delete(id);
    }
}
