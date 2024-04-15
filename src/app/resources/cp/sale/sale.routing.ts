// ================================================================>> Core Library (Angular)
import { Routes } from '@angular/router';

// ================================================================>> Custom Library (Application-specific)
import * as saleComponent from './sale.component';

export default [
    {
        path        : '',
        component   : saleComponent.SaleComponent
    },
] as Routes;
