import { Routes } from '@nestjs/core';
import { AuthModule } from './resources/auth/auth.module';
import { DashboardModule } from './resources/cp/dashboard/dashboard.module';
import { PosModule } from './resources/cp/pos/pos.module';
import { SaleModule } from './resources/cp/sale/sale.module';
import { ProductModule } from './resources/cp/product/product.module';
import { ProductsTypeModule } from './resources/cp/product/type/type.module';
import { UserModule } from './resources/cp/user/user.module';
import { ProfileModule } from './resources/cp/profile/profile.module';
import { InvoiceModule } from './resources/cp/invoice/invoice.module';

export const appRoutes: Routes = [{
    path: 'api',
    children: [
        {
            path: 'auth',
            module: AuthModule
        },
        {
            path: 'dashboard',
            module: DashboardModule
        },
        {
            path: 'pos',
            module: PosModule
        },
        {
            path: 'sales',
            module: SaleModule
        },
        {
            path: 'products',
            module: ProductModule,
            children: [
                {
                    path: 'type',
                    module: ProductsTypeModule
                }
            ]
        },
        {
            path: 'users',
            module: UserModule
        },
        {
            path: 'profile',
            module: ProfileModule
        },
        {
            path: 'print',
            module: InvoiceModule
        }
    ]
}];