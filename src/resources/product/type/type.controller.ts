import { Controller, Get, Post, Put, Delete, UseGuards, ParseIntPipe, Param, Body, HttpCode } from '@nestjs/common';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';
import { ProductsTypeService } from './type.service';
import { CreateProductTypeDto, UpdateProductTypeDto } from './type.dto';

@Roles(UserRoleDecorator.ADMIN)
@UseGuards(AuthGuard)
@Controller('api/products/type')
export class ProductsTypeController {
    constructor(private typeService: ProductsTypeService) { };

    @Get()
    listing() {
        return this.typeService.listing();
    }

    @Post()
    create(
        @Body() body: CreateProductTypeDto,
    ): Promise<any> {
        return this.typeService.create(body);
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
    async delete(@Param('id') id: number): Promise<{ statusCode: number, message: string }> {
        return await this.typeService.delete(id);
    }
}
