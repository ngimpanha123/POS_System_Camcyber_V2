// ================================================================>> Core Library
import { Route }                from '@angular/router';

// ================================================================>> Custom Library
import { initialDataResolver }  from 'app/app.resolvers';
import { AuthGuard }            from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard }          from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent }      from 'app/layout/layout.component';

export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path        : 'auth',
        canActivate : [NoAuthGuard],
        component   : LayoutComponent,
        data: {
            layout  : 'empty'
        },
        loadChildren: () => import('app/resources/auth/auth.routes')
    },

    // Admin routes
    {
        path        : '',
        canActivate : [AuthGuard],
        component   : LayoutComponent,
        resolve     : {
            initialData: initialDataResolver
        },
        children    : [

            {
                path        : 'dashboard',
                loadChildren: () => import('app/resources/dashboard/dashboard.routing')
            },
            {
                path        : 'pos',
                loadChildren: () => import('app/resources/pos/pos.routing')
            },
            {
                path        : 'sales',
                loadChildren: () => import('app/resources/sale/sale.routing')
            },
            {
                path        : 'products',
                loadChildren: () => import('app/resources/product/product.routing')
            },
            {
                path        : 'users',
                loadChildren: () => import('app/resources/user/user.routing')
            },
            {
                path        : 'profile',
                loadChildren: () => import('app/resources/profile/profile.routing')
            },

            // 404 & Catch all
            {
                path: '404-not-found',
                pathMatch: 'full',
                loadChildren: () => import('app/resources/error/error-404.module').then(m => m.Error404Module),
                canActivate: [AuthGuard]
            },
            { path: '**', redirectTo: '404-not-found' }
        ]
    }
];
