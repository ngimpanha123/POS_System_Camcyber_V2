// ================================================================>> Core Library
import { Controller, Get, Post, Param, ParseIntPipe, Query, UseGuards, UsePipes, Body, Put, Delete, BadRequestException } from '@nestjs/common';

// ================================================================>> Costom Library
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { ProductService } from './product.service';
import { ProductsTypeExistsPipe } from 'src/shared/pipes/product.pipe';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { FileService } from 'src/services/file.service';
import { FileResponse } from 'src/shared/file.interface';
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';

// Applying roles and guards to the controller
@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/products')
export class ProductController {

    constructor(
        private productService: ProductService,
        private fileService: FileService
    ) { };

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
        // Validate and process the base64-encoded image
        const base64PrefixJPEG = 'data:image/jpeg;base64,';
        const base64PrefixPNG = 'data:image/png;base64,';
        if (!(typeof body.image === 'string' && (body.image.startsWith(base64PrefixJPEG) || body.image.startsWith(base64PrefixPNG)))) {
            throw new BadRequestException('Invalid image');
        }
        try {
            const image: FileResponse = await this.fileService.base64Image(body.image);
            body.image = image.data.uri;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
        return await this.productService.create(body);
    }

    // Endpoint to update an existing product
    @Put(':id')
    @UsePipes(ProductsTypeExistsPipe)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto
    ) {
        if (body.image) {
            // Check if the image is a string and starts with the valid prefixes
            const base64PrefixJPEG = 'data:image/jpeg;base64,';
            const base64PrefixPNG = 'data:image/png;base64,';
            if (!(typeof body.image === 'string' && (body.image.startsWith(base64PrefixJPEG) || body.image.startsWith(base64PrefixPNG)))) {
                throw new BadRequestException('Invalid image');
            }
            let image: FileResponse;
            try {
                image = await this.fileService.base64Image(body.image);
            } catch (error) {
                throw new BadRequestException(error.message);
            }
            // Replace base64 string by file URI from FileService
            body.image = image.data.uri;
        }
        else {
            body.image = undefined;
        }
        return this.productService.update(body, id);
    }

    // Endpoint to delete an existing product
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ status_code: number, message: string }> {
        return await this.productService.delete(id);
    }
}
