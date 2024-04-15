// ================================================================>> Core Library
import { Routes } from '@nestjs/core';

// ================================================================>> Custom Library
// Account
import { AuthModule } from './app/resources/account/auth/auth.module';
import { ProfileModule } from './app/resources/account/profile/profile.module';

import { DashboardModule } from './app/resources/cp/dashboard/dashboard.module';

import { PosModule } from './app/resources/cp/pos/pos.module';
import { SaleModule } from './app/resources/cp/sale/sale.module';
import { InvoiceModule } from './app/resources/cp/invoice/invoice.module';

import { ProductModule } from './app/resources/cp/product/product.module';
import { ProductsTypeModule } from './app/resources/cp/product/type/type.module';

import { UserModule } from './app/resources/cp/user/user.module';

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