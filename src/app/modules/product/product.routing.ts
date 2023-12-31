import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { roleResolver } from 'helpers/resolvers/roles.resolver';

export default [
    {
        path: '',
        resolve: {
            roles: roleResolver(['Admin'])
        },
        component: ProductComponent,
        children: [
            {
                path: 'all',
                component: ProductComponent
            },
            {
                path: 'type',
                loadChildren: () => import('./type/type.routing')
            }
        ]
    }
] as Routes;
