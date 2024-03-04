// =========================================================================>> Core Library
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// =========================================================================>> Third Party Library

// =========================================================================>> Custom Library
import { ExceptionErrorsFilter } from './exceptions/errors.filter';
// Module
import { AuthModule } from './resources/auth/auth.module';
import { DashboardModule } from './resources/cp/dashboard/dashboard.module';
import { ProfileModule } from './resources/cp/profile/profile.module';
import { UserModule } from './resources/cp/user/user.module';
import { ProductModule } from './resources/cp/product/product.module';
import { PosModule } from './resources/cp/pos/pos.module';
import { SaleModule } from './resources/cp/sale/sale.module';
import { InvoiceModule } from './resources/cp/invoice/invoice.module';
import { ConfigModule } from './config/config.module';
// Middleware
import { JwtMiddleware } from './middlewares/jwt.middleware';
// Bass Controller
import { AppController } from './app.controller';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    controllers: [
        AppController
    ],
    imports: [
        // Apply global config module for use every where we need
        ConfigModule,
        // Load modules of POS resources
        AuthModule,
        DashboardModule,
        ProfileModule,
        UserModule,
        ProductModule,
        PosModule,
        SaleModule,
        InvoiceModule
    ],
    providers: [
        // all this we it the same use as Global in main.ts
        /**
         * @noted If we use as Global in main.ts => app.useGlobalFilters(new ExceptionErrorsFilter());
         */
        {
            provide: APP_FILTER,
            useClass: ExceptionErrorsFilter,
        },
        /**
         * @noted If we use as Global in main.ts => app.useGlobalInterceptors(new TimeoutInterceptor());
         */
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor
        },
        /**
         * @noted If we use as Global in main.ts => 
         * app.useGlobalInterceptors(new TransformInterceptor());
         */
        {
            provide: APP_INTERCEPTOR,
            useFactory: () => new TransformInterceptor(), //=> We can useClass like TimeoutInterceptor
            inject: []
        }
    ]
})
/**
 * @author Yim Klok <yimklok.kh@gmail.com>
 */
export class AppModule implements NestModule {
    // Apply global jwt middleware exclude only login and register
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .exclude(
                {
                    path: 'api/auth/login', method: RequestMethod.POST
                },
                {
                    path: 'api/auth/register', method: RequestMethod.POST
                })
            .forRoutes({ path: '*', method: RequestMethod.ALL });
        // We can add more consumer if use have other middleware. 
        // Ex: Apply AdminMiddleware specifically to UserController and ProductController
        // consumer
        //     .apply(AdminMiddleware)
        //     .forRoutes(UserController, ProductController);
        // =====> But we should we AdminMiddleware inside UserModule and ProductModule itself.
    }
}
// For dashboard, invoice, pos, profile and sale I will apply Guards concept in NestJS