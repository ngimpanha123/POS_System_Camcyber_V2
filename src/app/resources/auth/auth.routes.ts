// ================================================================>> Core Libraries
import { Routes }               from '@angular/router';

// ================================================================>> Custom Libraries (Application-specific)
import { AuthLoginComponent }   from 'app/resources/auth/auth.component';

export default [
    {
        path     : 'login',
        component: AuthLoginComponent,
    }
] as Routes;
