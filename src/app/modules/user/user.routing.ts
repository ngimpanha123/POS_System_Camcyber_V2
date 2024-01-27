// ================================================================ Core Library
import { Routes } from '@angular/router';

// ================================================================ Third Party Library

// ================================================================ Costom Library
import { roleResolver } from 'helpers/resolvers/roles.resolver';
import { UserComponent } from './user.component';

export default [
    {
        path: '',
        resolve: {
            roles: roleResolver(['Admin'])
        },
        component: UserComponent
    },
] as Routes;
