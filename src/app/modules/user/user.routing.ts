import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { roleResolver } from 'helpers/resolvers/roles.resolver';

export default [
    {
        path: '',
        resolve: {
            roles: roleResolver(['Admin'])
        },
        component: UserComponent
    },
] as Routes;
