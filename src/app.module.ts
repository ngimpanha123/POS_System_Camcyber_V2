// =========================================================================>> Core Library
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// =========================================================================>> Third Party Library

// =========================================================================>> Custom Library
// Model
import { DatabaseModule } from './models/database.module';

// Middleware (Authenication & Authorization)
import { AuthInterceptor } from './middleware/interceptors/auth.interceptor';

// Shared
import { ExceptionFilterErrors } from './shared/handle.errors';

// Module
import { AuthModule } from './resources/auth/auth.module';
import { DashboardModule } from './resources/cp/dashboard/dashboard.module';
import { ProfileModule } from './resources/cp/profile/profile.module';
import { UserModule } from './resources/cp/user/user.module';
import { ProductModule } from './resources/cp/product/product.module';
import { PosModule } from './resources/cp/pos/pos.module';
import { SaleModule } from './resources/cp/sale/sale.module';
import { InvoiceModule } from './resources/cp/invoice/invoice.module';

// Custom External Lib
import { AppController } from './app.controller';

// ======================================= >> Code Starts Here << ========================== //
@Module({
    imports: [
        DatabaseModule, 
        AuthModule,
        DashboardModule,
        ProfileModule,
        UserModule,
        ProductModule,
        PosModule,
        SaleModule,
        InvoiceModule
    ],
    controllers: [AppController], // Controller Declaration
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AuthInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionFilterErrors,
        }
    ],
})
export class AppModule { }
