import { Module } from '@nestjs/common';
import { ProductsTypeController } from './type.controller';
import { ProductsTypeService } from './type.service';

@Module({
    controllers: [ProductsTypeController],
    providers: [ProductsTypeService],
    imports: []
})
export class ProductsTypeModule { }
