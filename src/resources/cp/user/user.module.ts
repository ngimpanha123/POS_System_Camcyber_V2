// ================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// ================================================================>> Costom Library
import { UserService } from './user.service';
import { FileService } from 'src/services/file.service';
import { UserController } from './user.controller';
import { AdminMiddleware } from 'src/middlewares/admin.middleware';

@Module({
    providers: [UserService, FileService],
    controllers: [UserController],
    imports: []
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AdminMiddleware).forRoutes(UserController); // Apply to all routes in this user module
    }
}
