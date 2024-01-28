// ================================================================ Core Library
import { Routes } from '@angular/router';

// ================================================================ Third Party Library

// ================================================================ Costom Library
import { roleResolver } from 'helpers/resolvers/roles.resolver';
import { UserComponent } from './user.component';

// Define Angular routes for the User module
export default [
    {
        path        : '',
        resolve     : {                                 // Resolve roles before activating the route
            roles   : roleResolver(['Admin'])           // Use the roleResolver to ensure only users with the 'Admin' role can access this route
        }, 
        component   : UserComponent                     // Component to be displayed when the route is activated
    },
] as Routes;
