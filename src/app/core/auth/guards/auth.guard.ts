// ================================================================>> Core Library
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

// ================================================================>> Third Party Library
import { of, switchMap } from 'rxjs';

// ================================================================>> Custom Librar
import { AuthService } from 'app/core/auth/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (_route, _state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) => {
            // If the user is not authenticated...
            if (!authenticated) {
                const urlTree = router.parseUrl(`auth/login`);
                return of(urlTree);
            }
            // Allow the access
            return of(true);
        }),
    );
};
