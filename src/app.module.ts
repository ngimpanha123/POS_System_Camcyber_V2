import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './models/database.module';
import { AuthModule } from './resources/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilterErrors } from './shared/handle.errors';
import { AuthInterceptor } from './middleware/interceptors/auth.interceptor';
import { DashboardModule } from './resources/dashboard/dashboard.module';

@Module({
    imports: [
        DatabaseModule, 
        AuthModule,
        DashboardModule
    ],
    controllers: [AppController],
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
