// ================================================================>> Core Library
import { inject }               from '@angular/core';
import { Router }               from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

// ================================================================>> Third party Library
import jwt_decode               from 'jwt-decode';

// ================================================================>> Custom Library
import { User }                 from './core/user/user.types';
import { AuthService }          from './core/auth/auth.service';
import { UserService }          from './core/user/user.service';
import { NavigationService }    from 'app/core/navigation/navigation.service';


// Define the structure of the decoded JWT payload
interface UserPayload {
    exp     : number;                            // Expiration time of the token
    iat     : number;                            // Issued at time of the token
    user    : User;                             // User information from the token
    role    : string;                           // Role of the user
}

// Map roles to corresponding navigation service methods
const roleServiceMap = {

    'Admin': {
        navigationServiceMethod: 'getAdminNavigation',
    },
    'Staff': {
        navigationServiceMethod: 'getStaffNavigation',
    }
};

// Function to resolve initial data before component initialization
export const initialDataResolver = () => {

    // Dependency injection of required services
    const router            = inject(Router);
    const token             = inject(AuthService).accessToken;
    const navigationService = inject(NavigationService);

    const tokenPayload: UserPayload = jwt_decode(token);                            // Decode the JWT token to get user information and role                                          
    inject(UserService).user = tokenPayload.user;                                   // Set the user information in the UserService
    const roleConfig = roleServiceMap[tokenPayload.role];                           // Retrieve role-specific configuration
    
    if (roleConfig) {
        
        inject(UserService).role    = tokenPayload.role;                                           // Set the user role in the UserService
        const navigationObservable  = navigationService[roleConfig.navigationServiceMethod]();   // Call the appropriate navigation service method based on the user role
        
        // Return an Observable combining the navigation data
        return forkJoin({
            navigation: navigationObservable
        });
        
    } else {

        // If the user role is not recognized, clear local storage, navigate to the default route, and return an empty Observable
        localStorage.clear();
        router.navigateByUrl('');
        return new Observable<any[]>();
    }
};