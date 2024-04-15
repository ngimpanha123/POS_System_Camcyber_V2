// ================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// ================================================================>> Costom Library
import { ProductsTypeModule } from './type/type.module';

// Custom Components:
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FileService } from 'src/app/services/file.service';
import { AdminMiddleware } from 'src/app/middlewares/admin.middleware';
import { ProductsTypeController } from './type/type.controller';

@Module({
    imports: [ProductsTypeModule],
    controllers: [ProductController],
    providers: [ProductService, FileService]
})
export class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AdminMiddleware).forRoutes(ProductController, ProductsTypeController);
    }
}
