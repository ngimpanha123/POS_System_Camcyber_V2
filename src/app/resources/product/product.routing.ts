// ================================================================>> Core library Angular Router
import { Routes } from '@angular/router';

// ================================================================>> Custom Library (Application-specific)
import { ProductComponent } from './product.component'; 
import { roleResolver } from 'helpers/resolvers/roles.resolver'; 


export default [

    {
        path        : '',
        resolve     : {
            roles: roleResolver(['Admin'])
        },

        children    : [
            {
                path        : 'all',
                component   : ProductComponent
            },
            {
                path        : 'type',
                loadChildren: () => import('./type/type.routing')
            }
        ]
    }
] as Routes;
