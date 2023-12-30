import { Module } from '@nestjs/common';
import { ProductsTypeModule } from './type/type.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FileService } from 'src/services/file.service';

@Module({
    imports: [ProductsTypeModule],
    controllers: [ProductController],
    providers: [ProductService, FileService]
})
export class ProductModule { }
