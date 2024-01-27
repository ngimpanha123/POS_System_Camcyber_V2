// ================================================================>> Core Library
import { inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

// ================================================================>> Third party Library
import jwt_decode from 'jwt-decode';

// ================================================================>> Custom Library
import { User } from './core/user/user.types';
import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/user/user.service';
import { NavigationService } from 'app/core/navigation/navigation.service';


interface UserPayload {
    exp: number;
    iat: number;
    user: User;
    role: string;
}

const roleServiceMap = {
    'Admin': {
        navigationServiceMethod: 'getAdminNavigation',
    },
    'Staff': {
        navigationServiceMethod: 'getStaffNavigation',
    }
};

export const initialDataResolver = () => {
    const router = inject(Router);
    const token = inject(AuthService).accessToken;
    const navigationService = inject(NavigationService);
    const tokenPayload: UserPayload = jwt_decode(token);
    inject(UserService).user = tokenPayload.user;
    const roleConfig = roleServiceMap[tokenPayload.role];
    if (roleConfig) {
        inject(UserService).role = tokenPayload.role;
        const navigationObservable = navigationService[roleConfig.navigationServiceMethod]();
        return forkJoin({
            navigation: navigationObservable
        });
    } else {
        localStorage.clear();
        router.navigateByUrl('');
        return new Observable<any[]>();
    }
};
