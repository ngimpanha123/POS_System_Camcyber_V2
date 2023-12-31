import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "app/core/user/user.service";
import { SnackbarService } from "helpers/services/snack-bar/snack-bar.service";
import { GlobalConstants } from "helpers/shared/global-constants";
import { of } from "rxjs";

export const roleResolver = (allowedRoles: string[]) => {
    return () => {
        const router = inject(Router);
        const snackBarService = inject(SnackbarService);
        let roleName: string = undefined;
        inject(UserService).role$.subscribe((roleCheck: string) => {
            roleName = allowedRoles.find(role => role === roleCheck);
        });
        // If the user is not authenticated...
        if (!roleName) {
            router.navigateByUrl('');
            return of(snackBarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error));
        }
        // Allow the access
        return of(allowedRoles);
    };
};
