// ================================================================>> Core Library
import { Module } from '@nestjs/common';

// ================================================================>> Costom Library
import { ProductsTypeModule } from './type/type.module';

// Custom Components:
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FileService } from 'src/services/file.service';

@Module({
    imports: [ProductsTypeModule],
    controllers: [ProductController],
    providers: [ProductService, FileService]
})
export class ProductModule { }
