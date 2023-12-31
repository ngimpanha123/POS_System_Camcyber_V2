import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Observable, forkJoin } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { User } from './core/user/user.types';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/user/user.service';

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
