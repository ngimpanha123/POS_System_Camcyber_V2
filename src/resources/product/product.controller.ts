import { Controller, Get, Post, Param, ParseIntPipe, Query, UseGuards, UsePipes, Body, Put, Delete, BadRequestException } from '@nestjs/common';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { ProductService } from './product.service';
import { ProductsTypeExistsPipe } from 'src/shared/pipes/product.pipe';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { FileService } from 'src/services/file.service';
import { FileResponse } from 'src/shared/file.interface';


@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/products')
export class ProductController {

    constructor(
        private productService: ProductService,
        private fileService: FileService
    ) { };

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

    @Post()
    @UsePipes(ProductsTypeExistsPipe)
    async create(
        @Body() body: CreateProductDto
    ) {
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
        // replace base64 string by file uri from FileService
        body.image = image.data.uri;
        return this.productService.create(body);
    }

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
            // replace base64 string by file uri from FileService
            body.image = image.data.uri;
        }
        else {
            body.image = undefined;
        }
        return this.productService.update(body, id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ statusCode: number, message: string }> {
        return await this.productService.delete(id);
    }
}
